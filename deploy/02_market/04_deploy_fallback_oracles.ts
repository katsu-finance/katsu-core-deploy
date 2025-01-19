import { getPythOracles } from "../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import {
  FALLBACK_ORACLE_ID,
  POOL_ADDRESSES_PROVIDER_ID,
} from "../../helpers/deploy-ids";
import {
  loadPoolConfig,
  ConfigNames,
  getReserveAddresses,
  getPriceIdOracles,
  checkRequiredEnvironment
} from "../../helpers/market-config-helpers";
import { eNetwork } from "../../helpers/types";
import { getPairsTokenPyth } from "../../helpers/init-helpers";
import { MARKET_NAME } from "../../helpers/env";
import { verify } from "../../helpers/verify";
import { V3_CORE_VERSION } from "../../helpers/constants";


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

  const { address: addressesProviderAddress } = await deployments.get(
    POOL_ADDRESSES_PROVIDER_ID
  );

  const reserveAssets = await getReserveAddresses(poolConfig, network);
  const pythConfig = await getPythOracles(poolConfig, network);
  console.log("pythConfig:", pythConfig);
  const priceIdConfig = await getPriceIdOracles(poolConfig, network);
  console.log("priceIdConfig:", priceIdConfig);
  
  const [assets, priceIds] = getPairsTokenPyth(reserveAssets,  priceIdConfig);
  if (network === "hardhat") {
    assets.push("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"); // ETH
    priceIds.push("0x0000000000000000000000000000000000000000000000000000000000000007"); // ETH
  }
  console.log("Assets:", assets, "Price IDs:", priceIds);

  const fallbackOracle = await deploy(FALLBACK_ORACLE_ID, {
    args: [addressesProviderAddress, pythConfig, assets, priceIds],
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
    contract: "FallbackOracle",
  });
  await verify(fallbackOracle.address, [addressesProviderAddress, pythConfig, assets, priceIds], hre.network.name);

  return true;
}

func.id = `Fallback Oracles:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "fallback oracle"];

func.dependencies = ["before-deploy"];

func.skip = async () => checkRequiredEnvironment();

export default func;