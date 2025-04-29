import { SilkBasketResponse } from '~/types/contracts/silkBasket/response';
import { SilkBasket, BasketItem, SilkBasketParsingStatus } from '~/types/contracts/silkBasket/model';
import { convertCoinFromUDenom } from '~/lib/utils';
import {
  BatchQueryParsedResponse,
  BatchItemResponseStatus,
  MinBlockHeightValidationOptions,
  BatchQueryParams,
  OraclePricesResponse,
  BatchQueryParsedResponseItem,
} from '~/types';
import { msgGetSilkBasket } from '~/contracts/definitions/silkBasket';
import {
  map,
  first,
  firstValueFrom,
  switchMap,
  of,
} from 'rxjs';
import { msgQueryOraclePrices } from '~/contracts/definitions';
import { SilkBasketBatchResponseItem } from '~/types/contracts/silkBasket/service';
import { batchQuery$ } from './batchQuery';

const ORACLE_NORMALIZATION_FACTOR = 18;

/**
 * parses the silk basket individual contract responses from the queries
 * into the shared data model.
 * This includes adding a parsing status to the output type for use in downstream
 * error/retry handling
 */
const parseSilkBasketAndPricesResponse = ({
  silkBasketResponse,
  batchBasketPricesResponse,
  silkBasketResponseBlockHeight,
  basketPricesResponseBlockHeight,
}:{
  silkBasketResponse: SilkBasketResponse,
  // return the prices batch data here instead of raw response
  // for error handling purposes
  batchBasketPricesResponse: BatchQueryParsedResponseItem,
  silkBasketResponseBlockHeight: number,
  basketPricesResponseBlockHeight: number,
}): SilkBasket & { status: SilkBasketParsingStatus } => {
  // block height validation
  // data should be returned in a single batch with a single block height and
  // never cause this error, but in case for any reason it does not, we will validate that here
  // to ensure accuracy of the data when performing calculations of two different sources
  if (silkBasketResponseBlockHeight !== basketPricesResponseBlockHeight) {
    throw new Error('basket data and prices were returned from different block heights so data accuracy cannot be confirmed.');
  }

  const { basket } = silkBasketResponse;

  const silkPrice = convertCoinFromUDenom(
    silkBasketResponse.peg.value,
    ORACLE_NORMALIZATION_FACTOR,
  );
  const silkInitialPrice = convertCoinFromUDenom(
    silkBasketResponse.peg.target,
    ORACLE_NORMALIZATION_FACTOR,
  );

  // initialize the return status to the success state which
  // will be modified if a different state is encountered
  let status = SilkBasketParsingStatus.SUCCESS;

  const basketItems: BasketItem[] = basket.map((item) => {
    // for the prices error state we will return basket data without prices
    if (batchBasketPricesResponse.status === BatchItemResponseStatus.ERROR) {
      status = SilkBasketParsingStatus.PRICES_MISSING;
      return {
        symbol: item.symbol,
        amount: item.weight.fixed,
        price: undefined,
        weight: {
          initial: item.weight.initial,
          current: undefined,
        },
      };
    }

    // for non-error state, there's also a chance a price could be missing due to a
    // change in the basket compared to the input oracle keys and so we will handle
    // that case as well
    const basketPricesResponse = batchBasketPricesResponse.response as OraclePricesResponse;

    const matchingPriceResponse = basketPricesResponse.find((price) => price.key === item.symbol);
    // price is missing so return undefined on the
    // calculated values. Query will need to be retried with modified oracle keys.
    if (!matchingPriceResponse) {
      status = SilkBasketParsingStatus.PRICES_MISSING;
      return {
        symbol: item.symbol,
        amount: item.weight.fixed,
        price: undefined,
        weight: {
          initial: item.weight.initial,
          current: undefined,
        },
      };
    }

    // confirmed price is available so we will return the price/weight calculated data
    const itemPrice = convertCoinFromUDenom(
      matchingPriceResponse.data.rate,
      ORACLE_NORMALIZATION_FACTOR,
    );
    const currentWeight = itemPrice.multipliedBy(item.weight.fixed).dividedBy(silkPrice);
    return {
      symbol: item.symbol,
      amount: item.weight.fixed,
      price: itemPrice.toString(),
      weight: {
        initial: item.weight.initial,
        current: currentWeight.decimalPlaces(ORACLE_NORMALIZATION_FACTOR).toString(),
      },
    };
  });

  return {
    symbol: silkBasketResponse.symbol,
    oracleRouterContract: {
      address: silkBasketResponse.router.address,
      codeHash: silkBasketResponse.router.code_hash,
    },
    staleInterval: Number(silkBasketResponse.when_stale),
    peg: {
      value: silkPrice.toString(),
      initialValue: silkInitialPrice.toString(),
      isFrozen: silkBasketResponse.peg.frozen,
      lastUpdatedAt: new Date(Number(silkBasketResponse.peg.last_updated) * 1000),
    },
    basket: basketItems,
    blockHeight: silkBasketResponseBlockHeight,
    status,
  };
};

/**
 * parses the silk basket and prices response via the query router
 */
function parseSilkBasketAndPricesResponseFromQueryRouter(
  batchQueryResponse: BatchQueryParsedResponse,
) {
  const responseCount = batchQueryResponse.length;
  if (responseCount !== 2) {
    throw new Error(`${responseCount} responses found, two responses are expected`);
  }

  const silkBasketResponse = batchQueryResponse.find((
    responseItem,
  ) => responseItem.id === SilkBasketBatchResponseItem.BASKET);

  // check if data exists
  if (!silkBasketResponse) {
    throw new Error('Silk basket response not found in query router response');
  }
  // handle error state
  if (silkBasketResponse.status === BatchItemResponseStatus.ERROR) {
    throw new Error(silkBasketResponse.response);
  }

  const pricesResponse = batchQueryResponse.find((
    responseItem,
  ) => responseItem.id === SilkBasketBatchResponseItem.PRICES);

  // check if data exists
  if (!pricesResponse) {
    throw new Error('prices response not found in query router response');
  }

  // for price error state we will not throw an error like we did with the basket
  // data as there is still useful data to get out of the peg info that we would like to parse.
  // Instead, we will pass the full batch data into the parser (which includes the
  // error status) and handle the error downstream.

  return parseSilkBasketAndPricesResponse({
    silkBasketResponse: silkBasketResponse.response,
    batchBasketPricesResponse: pricesResponse,
    silkBasketResponseBlockHeight: silkBasketResponse.blockHeight,
    basketPricesResponseBlockHeight: pricesResponse.blockHeight,
  });
}

/**
 * query the silk basket data
 */
function querySilkBasket$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  oracleContractAddress,
  oracleCodeHash,
  silkBasketExpectedOracleKeys = [], // if keys are known in advance it will
  // increase the efficiency of the response, but even if keys are unknown or
  // incorrectly passed in compared to the state of the basket,
  // this service will self-correct using a retry on the actual keys found.
  silkIndexOracleContractAddress,
  silkIndexOracleCodeHash,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  oracleContractAddress: string,
  oracleCodeHash: string,
  silkBasketExpectedOracleKeys?: string[]
  silkIndexOracleContractAddress: string,
  silkIndexOracleCodeHash: string,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  const basketQueryMsg :BatchQueryParams = {
    id: SilkBasketBatchResponseItem.BASKET,
    contract: {
      address: silkIndexOracleContractAddress,
      codeHash: silkIndexOracleCodeHash,
    },
    queryMsg: msgGetSilkBasket(),
  };

  const pricesQueryMsg:BatchQueryParams = {
    id: SilkBasketBatchResponseItem.PRICES,
    contract: {
      address: oracleContractAddress,
      codeHash: oracleCodeHash,
    },
    queryMsg: msgQueryOraclePrices(silkBasketExpectedOracleKeys),
  };

  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries: [basketQueryMsg, pricesQueryMsg],
    minBlockHeightValidationOptions,
  }).pipe(
    map(parseSilkBasketAndPricesResponseFromQueryRouter),
    switchMap((data) => {
      if (data.status === SilkBasketParsingStatus.PRICES_MISSING) {
        // retry with different oracle key array
        const pricesQueryMsgWithNewKeys:BatchQueryParams = {
          id: SilkBasketBatchResponseItem.PRICES,
          contract: {
            address: oracleContractAddress,
            codeHash: oracleCodeHash,
          },
          queryMsg: msgQueryOraclePrices(data.basket.map((item) => item.symbol)),
        };
        return batchQuery$({
          contractAddress: queryRouterContractAddress,
          codeHash: queryRouterCodeHash,
          lcdEndpoint,
          chainId,
          queries: [basketQueryMsg, pricesQueryMsgWithNewKeys],
          minBlockHeightValidationOptions,
        }).pipe(
          map(parseSilkBasketAndPricesResponseFromQueryRouter),
          first(),
        );
      }
      return of(data);
    }),
    // remove the status property because this was only needed for
    // handling missing prices
    map((data) => {
      const { status, ...otherProperties } = data;
      const silkBasket: SilkBasket = {
        ...otherProperties,
      };
      return silkBasket;
    }),
    first(),
  );
}

/**
 * query the silk basket data
 */
function querySilkBasket({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  oracleContractAddress,
  oracleCodeHash,
  silkBasketExpectedOracleKeys, // if keys are known in advance it will
  // increase the efficiency of the response, but even if keys are unknown or
  // incorrectly passed in compared to the state of the basket,
  // this service will self-correct using a retry on the actual keys found.
  silkIndexOracleContractAddress,
  silkIndexOracleCodeHash,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  oracleContractAddress: string,
  oracleCodeHash: string,
  silkBasketExpectedOracleKeys?: string[]
  silkIndexOracleContractAddress: string,
  silkIndexOracleCodeHash: string,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return firstValueFrom(querySilkBasket$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    oracleContractAddress,
    oracleCodeHash,
    silkBasketExpectedOracleKeys,
    silkIndexOracleContractAddress,
    silkIndexOracleCodeHash,
    minBlockHeightValidationOptions,
  }));
}

export {
  parseSilkBasketAndPricesResponse,
  parseSilkBasketAndPricesResponseFromQueryRouter,
  querySilkBasket$,
  querySilkBasket,
};
