import { ReserveInterestRateStrategyChangedEventObject } from './../../dist/types/typechain/@hedy_chu/core-v3/contracts/protocol/pool/PoolConfigurator.d';
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  chainlinkAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from "../../helpers/constants";
import { eNetwork } from "../../helpers";
import {getPythOracles,getPriceIdOracles} from "../../helpers/market-config-helpers";
import {
  loadPoolConfig,
  ConfigNames,
} from "../../helpers/market-config-helpers";
import { MARKET_NAME } from "../../helpers/env";
import {verify} from "../../helpers/verify";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const poolConfig = await loadPoolConfig(MARKET_NAME as ConfigNames);

  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  // if (!chainlinkAggregatorProxy[network]) {
  //   console.log(
  //     '[Deployments] Skipping the deployment of UiPoolDataProvider due missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts'
  //   );
  //   return;
  // }
  // Deploy UiIncentiveDataProvider getter helper
  const uiIncentiveDataProviderV3 = await deploy("UiIncentiveDataProviderV3", {
    from: deployer,
  });
  await verify(uiIncentiveDataProviderV3.address, [], hre.network.name);

  const pythConfig = await getPythOracles(poolConfig, network);
  console.log("pythConfig:", pythConfig);
  const priceIdConfig = await getPriceIdOracles(poolConfig, network);
  console.log("priceIdConfig:", priceIdConfig);
  const ipPriceId = priceIdConfig['IP'] ?? null;
  console.log("ipPriceId:", ipPriceId);

  // Deploy UiPoolDataProvider getter helper
  const uiPoolDataProviderV3 = await deploy("UiPoolDataProviderV3", {
    from: deployer,
    args: [
      pythConfig,
      ipPriceId,
      ipPriceId
    ],
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(uiPoolDataProviderV3.address, [
    pythConfig,
    ipPriceId,
    ipPriceId
  ], hre.network.name);
};

func.tags = ["periphery-post", "ui-helpers"];

export default func;
