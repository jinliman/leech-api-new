import BigNumber from 'bignumber.js';
import { MultiCall } from 'eth-multicall';
import { multicallAddress } from '../../../utils/web3';

import fetchPrice from '../../../utils/fetchPrice';
import { getApyBreakdown } from './getApyBreakdown';

// trading apr
import { SUSHI_LPF } from '../../../constants';
import { getTradingFeeAprSushi, getTradingFeeApr } from '../../../utils/getTradingFeeApr';
import { isSushiClient } from '../../../apollo/client';

// abis
import SushiComplexRewarderTime from '../../../abis/matic/SushiComplexRewarderTime.json';
import ERC20 from '../../../abis/ERC20.json';

const oracle = 'tokens';
const DECIMALS = '1e18';
const secondsPerBlock = 1;
const secondsPerYear = 31536000;

export const getMiniChefApys = async (params) => {
  const { pools, tradingClient, liquidityProviderFee } = params;
  const pairAddresses = pools.map(pool => pool.address);
  let tradingAprs;
  let fee;
  if (tradingClient !== undefined) {
    fee = liquidityProviderFee !== undefined ? liquidityProviderFee : SUSHI_LPF;
    tradingAprs = (await isSushiClient(tradingClient))
      ? await getTradingFeeAprSushi(tradingClient, pairAddresses, fee)
      : await getTradingFeeApr(tradingClient, pairAddresses, fee);
  } else {
    tradingAprs = {};
  }
  const farmApys = await getFarmApys(params);

  return getApyBreakdown(pools, tradingAprs, farmApys, fee);
};

const getFarmApys = async (params) => {
  const { web3, pools, minichefConfig, rewarderConfig } = params;
  const apys = [];

  // minichef
  const minichefContract = new web3.eth.Contract(
    minichefConfig.minichefAbi,
    minichefConfig.minichef
  );
  const miniChefTokenPerSecond = new BigNumber(
    await minichefContract.methods[minichefConfig.tokenPerSecondContractMethodName]().call()
  );
  const miniChefTotalAllocPoint = new BigNumber(
    await minichefContract.methods.totalAllocPoint().call()
  );
  const miniChefTokenPrice = await fetchPrice({ oracle, id: minichefConfig.outputOracleId });

  // rewarder, if rewarder is set
  let rewarderContract = undefined;
  let rewarderTokenPerSecond ;
  let rewarderTokenPrice;

  if (rewarderConfig) {
    rewarderContract = new web3.eth.Contract(
      SushiComplexRewarderTime,
      rewarderConfig.rewarder
    );
    rewarderTokenPerSecond = new BigNumber(await rewarderContract.methods.rewardPerSecond().call());
    rewarderTokenPrice = await fetchPrice({
      oracle,
      id: rewarderConfig.rewarderTokenOracleId,
    });
  }

  const { balances, allocPoints, rewardAllocPoints } = await getPoolsData(params);

  // get apy for each pool
  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i];

    const lpPrice = await fetchPrice({ oracle: 'lps', id: pool.name });
    const totalStakedInUsd = balances[i].times(lpPrice).dividedBy('1e18');

    let totalYearlyRewardsInUsd = new BigNumber(0);

    // MiniChef rewards
    const miniChefPoolBlockRewards = miniChefTokenPerSecond
      .times(allocPoints[i])
      .dividedBy(miniChefTotalAllocPoint);
    const miniChefYearlyRewards = miniChefPoolBlockRewards
      .dividedBy(secondsPerBlock)
      .times(secondsPerYear);
    const miniChefYearlyRewardsInUsd = miniChefYearlyRewards
      .times(miniChefTokenPrice)
      .dividedBy(DECIMALS);
    totalYearlyRewardsInUsd = totalYearlyRewardsInUsd.plus(miniChefYearlyRewardsInUsd);

    // Rewarder rewards, if rewarder is set
    if (rewarderConfig) {
      const allocPoint = rewardAllocPoints[i];
      const nativeRewards = rewarderTokenPerSecond
        .times(allocPoint)
        .dividedBy(rewarderConfig.rewarderTotalAllocPoint);
      const yearlyNativeRewards = nativeRewards.dividedBy(secondsPerBlock).times(secondsPerYear);
      const nativeRewardsInUsd = yearlyNativeRewards.times(rewarderTokenPrice).dividedBy(DECIMALS);
      totalYearlyRewardsInUsd = totalYearlyRewardsInUsd.plus(nativeRewardsInUsd);
    }

    const apy = totalYearlyRewardsInUsd.dividedBy(totalStakedInUsd);
    apys.push(apy);
  }
  return apys;
};

const getPoolsData = async (params) => {
  const { web3, pools, minichefConfig, rewarderConfig, chainId } = params;

  const minichefContract = new web3.eth.Contract(
    minichefConfig.minichefAbi,
    minichefConfig.minichef
  );

  // rewarder, if rewarder is set
  let rewarderContract = undefined;
  if (rewarderConfig) {
    rewarderContract = new web3.eth.Contract(
      SushiComplexRewarderTime,
      rewarderConfig.rewarder
    );
  }

  const balanceCalls = [];
  const allocPointCalls = [];
  const rewardAllocPointCalls = [];
  pools.forEach(pool => {
    const tokenContract = new web3.eth.Contract(ERC20, pool.address);
    balanceCalls.push({
      balance: tokenContract.methods.balanceOf(minichefConfig.minichef),
    });
    allocPointCalls.push({
      allocPoint: minichefContract.methods.poolInfo(pool.poolId),
    });

    // rewarder, if rewarder is set
    if (rewarderConfig && rewarderContract) {
      rewardAllocPointCalls.push({
        allocPoint: rewarderContract.methods.poolInfo(pool.poolId),
      });
    }
  });

  const multicall = new MultiCall(web3, multicallAddress(chainId));
  const multicallParams = [balanceCalls, allocPointCalls];

  // rewarder, if rewarder is set
  if (rewarderConfig) {
    multicallParams.push(rewardAllocPointCalls);
  }

  const res = await multicall.all(multicallParams);

  const balances = res[0].map(v => new BigNumber(v.balance));
  const allocPoints = res[1].map(v => v.allocPoint['2']);
  const rewardAllocPoints = rewarderConfig ? res[2].map(v => v.allocPoint['2']) : {};
  return { balances, allocPoints, rewardAllocPoints };
};
