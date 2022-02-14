import _PolyyeldMasterChef_ABI from './L1/PolyyeldMasterChef.json';
import _xYeldMasterChef_ABI from './L2/xYeldMasterChef.json';
import {
  ContractContext as PolyyeldMasterChef,
  PolyyeldMasterChefMethodNames,
} from './L1/types/PolyyeldMasterChef';
import {
  ContractContext as xYeldMasterChef,
  XYeldMasterChefMethodNames as xYeldMasterChefMethodNames,
} from './L2/types/xYeldMasterChef';

const PolyyeldMasterChef_ABI = _PolyyeldMasterChef_ABI;
const xYeldMasterChef_ABI = _xYeldMasterChef_ABI;
export {
  PolyyeldMasterChef,
  PolyyeldMasterChef_ABI,
  PolyyeldMasterChefMethodNames,
  xYeldMasterChef,
  xYeldMasterChef_ABI,
  xYeldMasterChefMethodNames,
};
