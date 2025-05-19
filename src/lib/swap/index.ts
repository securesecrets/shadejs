import { BigNumber } from 'bignumber.js';
import * as swapCalculationsV2 from './v2/swapCalculationsV2';
import * as routerV2 from './v2/routerV2';

const getRoutesV2 = routerV2.getRoutes;

export * from './v2/routeCalculator';

export * from './swapCalculations';
export * from './router';
export {
  swapCalculationsV2,
  BigNumber,
  getRoutesV2,
};
