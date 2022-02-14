import { leechfinance } from './platforms/leechfinance';
import { trisolaris } from './platforms/trisolaris';
import { solace } from './platforms/solace';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';

const _aurora = {
  platforms: {
    leechfinance,
    trisolaris,
    solace,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;

export const aurora = _aurora;
