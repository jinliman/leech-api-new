import { toChecksumAddress } from 'ethereumjs-util';
import fetch from 'node-fetch';

import transformTokenListToObject from '../util/transfomTokenListToObject';
import chainIdMap from '../util/chainIdMap';

const tokenLists = {
  bsc: ['https://gateway.pinata.cloud/ipfs/QmdKy1K5TMzSHncLzUXUJdvKi1tHRmJocDRfmCXxW5mshS'],
  quickswap: [
    'https://unpkg.com/quickswap-default-token-list@1.0.59/build/quickswap-default.tokenlist.json',
  ],
  avax: [
    'https://raw.githubusercontent.com/pangolindex/tokenlists/main/aeb.tokenlist.json',
    'https://raw.githubusercontent.com/pangolindex/tokenlists/main/defi.tokenlist.json',
    'https://raw.githubusercontent.com/pangolindex/tokenlists/main/stablecoin.tokenlist.json',
  ],
};

const toChecksumTokenList = (tokens) => {
  for (const token of tokens) {
    token.address = toChecksumAddress(token.address);
  }
};

(async () => {
  const chainId = chainIdMap.bsc;
  let tokens = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tokenListFinal;
  for (const tokenList of tokenLists.bsc) {
    const response = await fetch(tokenList);
    const tokenListTmp = (await response.json());
    tokenListFinal = tokenListTmp;
    tokens = [...tokens, ...tokenListTmp.tokens];
  }
  toChecksumTokenList(tokens);
  tokenListFinal.tokens = tokens;
  const toMap = transformTokenListToObject(tokenListFinal, chainId);
  console.log(JSON.stringify(toMap));
})();
