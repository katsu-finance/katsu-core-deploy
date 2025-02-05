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

  let chainlinkAggregatorProxyAddress;
  let chainlinkEthUsdAggregatorProxyAddress;
  if (hre.network.name =="story-testnet" || hre.network.name =="hardhat") {
    chainlinkAggregatorProxyAddress = (await deployments.get("WIP-TestnetPriceAggregator-story")).address;
    chainlinkEthUsdAggregatorProxyAddress = (await deployments.get("WIP-TestnetPriceAggregator-story")).address;
  }else {
    chainlinkAggregatorProxyAddress = chainlinkAggregatorProxy[network];
    chainlinkEthUsdAggregatorProxyAddress = chainlinkEthUsdAggregatorProxy[network];
  }
  console.log("chainlinkAggregatorProxyAddress", chainlinkAggregatorProxyAddress);
  console.log("chainlinkEthUsdAggregatorProxyAddress", chainlinkEthUsdAggregatorProxyAddress);

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


  // Deploy UiPoolDataProvider getter helper
  const uiPoolDataProviderV3 = await deploy("UiPoolDataProviderV3", {
    from: deployer,
    args: [
      chainlinkAggregatorProxyAddress,
      chainlinkEthUsdAggregatorProxyAddress,
    ],
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(uiPoolDataProviderV3.address, [
    chainlinkAggregatorProxyAddress,
    chainlinkEthUsdAggregatorProxyAddress,
  ], hre.network.name);
};

func.tags = ["periphery-post", "ui-helpers"];

export default func;
