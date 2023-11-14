import { encodeJsonToB64 } from '~/lib/utils';
import { Snip20MessageRequest } from '~/types/contracts/snip20/model';

const snip20 = {
  queries: {
    getBalance(address: string, key:string) {
      return {
        balance: {
          address,
          key,
        },
      };
    },
    tokenInfo() {
      return {
        token_info: {},
      };
    },
  },
  messages: {
    send({
      recipient,
      recipientCodeHash,
      amount,
      handleMsg,
      padding,
    }: {
      recipient: string,
      recipientCodeHash?: string,
      amount: string,
      handleMsg: any,
      padding?: string,
    }): Snip20MessageRequest {
      const msg = {
        send: {
          recipient,
          recipient_code_hash: recipientCodeHash,
          amount,
          msg: handleMsg !== null ? encodeJsonToB64(handleMsg) : null,
          padding,
        },
      };
      return {
        msg,
      };
    },

    transfer({
      recipient,
      amount,
      padding,
    }: {
      recipient: string,
      amount: string,
      padding?: string,
    }): Snip20MessageRequest {
      const msg = {
        transfer: {
          recipient,
          amount,
          padding,
        },
      };
      return {
        msg,
      };
    },

    deposit(
      amount: string,
      denom: string,
    ): Snip20MessageRequest {
      const msg = { deposit: { } };
      const transferAmount = { amount, denom };
      return {
        msg,
        transferAmount,
      };
    },

    redeem({
      amount,
      denom,
      padding,
    }:{
      amount: string,
      denom: string,
      padding?: string,
    }): Snip20MessageRequest {
      const msg = {
        redeem: {
          amount,
          denom,
          padding,
        },
      };
      return {
        msg,
      };
    },

    increaseAllowance({
      spender,
      amount,
      expiration,
      padding,
    }:{
      spender: string,
      amount: string,
      expiration?: number,
      padding?: string,
    }): Snip20MessageRequest {
      const msg = {
        increase_allowance: {
          spender,
          amount,
          expiration,
          padding,
        },
      };
      return {
        msg,
      };
    },

    createViewingKey(viewingKey: string, padding?: string): Snip20MessageRequest {
      const msg = {
        set_viewing_key: {
          key: viewingKey,
          padding,
        },
      };
      return {
        msg,
      };
    },
  },
};

export {
  snip20,
};
