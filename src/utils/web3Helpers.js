import Web3 from 'web3';
import { addressBookByChainId, ChainId } from '../../packages/address-book/address-book';

import {
  BSC_RPC_ENDPOINTS,
  HECO_RPC,
  AVAX_RPC,
  POLYGON_RPC,
  FANTOM_RPC,
  ONE_RPC,
  BSC_CHAIN_ID,
  HECO_CHAIN_ID,
  AVAX_CHAIN_ID,
  POLYGON_CHAIN_ID,
  FANTOM_CHAIN_ID,
  ONE_CHAIN_ID,
  ARBITRUM_RPC,
  ARBITRUM_CHAIN_ID,
  CELO_RPC,
  CELO_CHAIN_ID,
  MOONRIVER_RPC,
  MOONRIVER_CHAIN_ID,
  CRONOS_RPC,
  CRONOS_CHAIN_ID,
  AURORA_RPC,
  AURORA_CHAIN_ID,
  FUSE_RPC,
  FUSE_CHAIN_ID,
  METIS_RPC,
  METIS_CHAIN_ID,
  MOONBEAM_RPC,
  MOONBEAM_CHAIN_ID,
} from '../constants';

const MULTICALLS = {
  [ChainId.bsc]: addressBookByChainId[ChainId.bsc].platforms.leechfinance.multicall,
  [ChainId.heco]: addressBookByChainId[ChainId.heco].platforms.leechfinance.multicall,
  [ChainId.polygon]: addressBookByChainId[ChainId.polygon].platforms.leechfinance.multicall,
  [ChainId.fantom]: addressBookByChainId[ChainId.fantom].platforms.leechfinance.multicall,
  [ChainId.avax]: addressBookByChainId[ChainId.avax].platforms.leechfinance.multicall,
  [ChainId.one]: addressBookByChainId[ChainId.one].platforms.leechfinance.multicall,
  [ChainId.arbitrum]: addressBookByChainId[ChainId.arbitrum].platforms.leechfinance.multicall,
  [ChainId.celo]: addressBookByChainId[ChainId.celo].platforms.leechfinance.multicall,
  [ChainId.moonriver]: addressBookByChainId[ChainId.moonriver].platforms.leechfinance.multicall,
  [ChainId.cronos]: addressBookByChainId[ChainId.cronos].platforms.leechfinance.multicall,
  [ChainId.aurora]: addressBookByChainId[ChainId.aurora].platforms.leechfinance.multicall,
  [ChainId.fuse]: addressBookByChainId[ChainId.fuse].platforms.leechfinance.multicall,
  [ChainId.metis]: addressBookByChainId[ChainId.metis].platforms.leechfinance.multicall,
  [ChainId.moonbeam]: addressBookByChainId[ChainId.moonbeam].platforms.leechfinance.multicall,
};

const clients = {
  bsc: [],
  heco: [],
  avax: [],
  polygon: [],
  fantom: [],
  one: [],
  arbitrum: [],
  celo: [],
  moonriver: [],
  cronos: [],
  aurora: [],
  fuse: [],
  metis: [],
  moonbeam: [],
};
BSC_RPC_ENDPOINTS.forEach(endpoint => {
  clients.bsc.push(new Web3(endpoint));
});
clients.heco.push(new Web3(HECO_RPC));
clients.avax.push(new Web3(AVAX_RPC));
clients.polygon.push(new Web3(POLYGON_RPC));
clients.fantom.push(new Web3(FANTOM_RPC));
clients.one.push(new Web3(ONE_RPC));
clients.arbitrum.push(new Web3(ARBITRUM_RPC));
clients.celo.push(new Web3(CELO_RPC));
clients.moonriver.push(new Web3(MOONRIVER_RPC));
clients.cronos.push(new Web3(CRONOS_RPC));
clients.aurora.push(new Web3(AURORA_RPC));
clients.fuse.push(new Web3(FUSE_RPC));
clients.metis.push(new Web3(METIS_RPC));
clients.moonbeam.push(new Web3(MOONBEAM_RPC));

export const chainRandomClients = {
  bscRandomClient: () => clients.bsc[~~(clients.bsc.length * Math.random())],
  hecoRandomClient: () => clients.heco[~~(clients.heco.length * Math.random())],
  avaxRandomClient: () => clients.avax[~~(clients.avax.length * Math.random())],
  polygonRandomClient: () => clients.polygon[~~(clients.polygon.length * Math.random())],
  fantomRandomClient: () => clients.fantom[~~(clients.fantom.length * Math.random())],
  oneRandomClient: () => clients.one[~~(clients.one.length * Math.random())],
  arbitrumRandomClient: () => clients.arbitrum[~~(clients.arbitrum.length * Math.random())],
  celoRandomClient: () => clients.celo[~~(clients.celo.length * Math.random())],
  moonriverRandomClient: () => clients.moonriver[~~(clients.moonriver.length * Math.random())],
  cronosRandomClient: () => clients.cronos[~~(clients.cronos.length * Math.random())],
  auroraRandomClient: () => clients.aurora[~~(clients.aurora.length * Math.random())],
  fuseRandomClient: () => clients.fuse[~~(clients.fuse.length * Math.random())],
  metisRandomClient: () => clients.metis[~~(clients.metis.length * Math.random())],
  moonbeamRandomClient: () => clients.moonbeam[~~(clients.moonbeam.length * Math.random())],
};

export const _web3Factory = (chainId) => {
  switch (chainId) {
    case BSC_CHAIN_ID:
      return chainRandomClients.bscRandomClient();
    case HECO_CHAIN_ID:
      return chainRandomClients.hecoRandomClient();
    case AVAX_CHAIN_ID:
      return chainRandomClients.avaxRandomClient();
    case POLYGON_CHAIN_ID:
      return chainRandomClients.polygonRandomClient();
    case FANTOM_CHAIN_ID:
      return chainRandomClients.fantomRandomClient();
    case ONE_CHAIN_ID:
      return chainRandomClients.oneRandomClient();
    case ARBITRUM_CHAIN_ID:
      return chainRandomClients.arbitrumRandomClient();
    case CELO_CHAIN_ID:
      return chainRandomClients.celoRandomClient();
    case MOONRIVER_CHAIN_ID:
      return chainRandomClients.moonriverRandomClient();
    case CRONOS_CHAIN_ID:
      return chainRandomClients.cronosRandomClient();
    case AURORA_CHAIN_ID:
      return chainRandomClients.auroraRandomClient();
    case FUSE_CHAIN_ID:
      return chainRandomClients.fuseRandomClient();
    case METIS_CHAIN_ID:
      return chainRandomClients.metisRandomClient();
    case MOONBEAM_CHAIN_ID:
      return chainRandomClients.moonbeamRandomClient();
  }
};

export const _multicallAddress = (chainId) => MULTICALLS[chainId];
