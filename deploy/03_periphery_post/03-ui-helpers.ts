import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  chainlinkAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from "../../helpers/constants";
import { eNetwork } from "../../helpers";
import { verify } from "../../helpers/verify";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  if (!chainlinkAggregatorProxy[network]) {
    console.log(
      '[Deployments] Skipping the deployment of UiPoolDataProvider due missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts'
    );
    return;
  }
  // Deploy UiIncentiveDataProvider getter helper
  const uiIncentiveDataProviderV3 = await deploy("UiIncentiveDataProviderV3", {
    from: deployer,
  });
  await verify(uiIncentiveDataProviderV3.address, [], hre.network.name);


  // Deploy UiPoolDataProvider getter helper
  const uiPoolDataProviderV3 = await deploy("UiPoolDataProviderV3", {
    from: deployer,
    args: [
      chainlinkAggregatorProxy[network],
      chainlinkEthUsdAggregatorProxy[network],
    ],
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(uiPoolDataProviderV3.address, [
    chainlinkAggregatorProxy[network],
    chainlinkEthUsdAggregatorProxy[network],
  ], hre.network.name);
};

func.tags = ["periphery-post", "ui-helpers"];

export default func;
