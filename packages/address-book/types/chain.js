import { LeechFinance } from './leechfinance';
import type Token from './token';

export default interface Chain {
  readonly platforms: Record<string, Record<string, unknown>> & {
    leechfinance: LeechFinance;
  };
  readonly tokens: Record<string, Token>;
  readonly tokenAddressMap: Record<string, Token>;
}
