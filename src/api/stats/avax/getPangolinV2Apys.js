import { avaxWeb3 } from '../../../utils/web3';
import { AVAX_CHAIN_ID } from '../../../constants';
import { getMiniChefApys } from '../common/getMiniChefApys';
import pools from '../../../data/avax/pangolinv2LpPools.json';
import PangolinChef from '../../../abis/avax/PangolinChef.json';
import { PANGOLIN_LPF } from '../../../constants';

const { pangolinClient } = require('../../../apollo/client');

import { addressBook } from '../../../../packages/address-book/address-book';
const {
  avax: {
    platforms: {
      pangolin: { minichef },
    },
    tokens: { PNG },
  },
} = addressBook;

export const getPangolinV2Apys = () => {
  return getMiniChefApys({
    minichefConfig: {
      minichef,
      minichefAbi: PangolinChef,
      outputOracleId: PNG.symbol,
      tokenPerSecondContractMethodName: 'rewardPerSecond',
    },
    pools,
    tradingClient: pangolinClient,
    sushiClient: false,
    liquidityProviderFee: PANGOLIN_LPF,
    web3: avaxWeb3,
    chainId: AVAX_CHAIN_ID,
  });
};
