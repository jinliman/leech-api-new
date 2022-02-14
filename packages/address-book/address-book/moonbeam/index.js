import { leechfinance } from './platforms/leechfinance';
import { beamswap } from './platforms/beamswap';
import { tokens } from './tokens/tokens';
import { convertSymbolTokenMapToAddressTokenMap } from '../../util/convertSymbolTokenMapToAddressTokenMap';

const _moonbeam = {
  platforms: {
    leechfinance,
    beamswap,
  },
  tokens,
  tokenAddressMap: convertSymbolTokenMapToAddressTokenMap(tokens),
} as const;

export const moonbeam = _moonbeam;
