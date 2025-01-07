import { TESTNET_REWARD_TOKEN_PREFIX } from "./../../../helpers/deploy-ids";
import {
  getSymbolsByPrefix,
  isIncentivesEnabled,
} from "./../../../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../../helpers/env";
import {
  checkRequiredEnvironment,
  ConfigNames,
  getReserveAddresses,
  isProductionMarket,
  loadPoolConfig,
  getPriceIdOracles,
} from "../../../helpers/market-config-helpers";
import { eNetwork,tPriceId } from "../../../helpers/types";
import { TESTNET_PRICE_PYTH_PREFIX } from "../../../helpers/deploy-ids";
import {
  MOCK_CHAINLINK_AGGREGATORS_PRICES,
  V3_CORE_VERSION,
} from "../../../helpers/constants";
import Bluebird from "bluebird";
import { MARKET_NAME } from "../../../helpers/env";

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

  if (isProductionMarket(poolConfig)) {
    console.log("[NOTICE] Skipping deployment of testnet price aggregators");
    return;
  }

  const reserves = await getReserveAddresses(poolConfig, network);

  let symbols = Object.keys(reserves);

  if (isIncentivesEnabled(poolConfig)) {
    const rewards = await getSymbolsByPrefix(TESTNET_REWARD_TOKEN_PREFIX);
    symbols = [...symbols, ...rewards];
  }

  const prices: string[] = [];
  const priceIds: tPriceId[] = [];
  const priceIdConfig = await getPriceIdOracles(poolConfig, network);
  console.log("priceIdConfig:", priceIdConfig);
  // Iterate each token symbol and deploy a mock aggregator
  await Bluebird.each(symbols, async (symbol) => {
    const price =
      symbol === "StkAave"
        ? MOCK_CHAINLINK_AGGREGATORS_PRICES["AAVE"]
        : MOCK_CHAINLINK_AGGREGATORS_PRICES[symbol];
    if (!price) {
      throw `[ERROR] Missing mock price for asset ${symbol} at MOCK_PYTH_PRICES constant located at src/constants.ts`;
    }
    prices.push(price);
    
    priceIds.push(priceIdConfig[symbol]);
  });
  prices.push(MOCK_CHAINLINK_AGGREGATORS_PRICES['IP']);
  priceIds.push(priceIdConfig['IP']);
  console.log("pyth priceIds:", priceIds);
  console.log("pyth prices:", prices);
    await deploy(`${TESTNET_PRICE_PYTH_PREFIX}`, {
      args: [priceIds, prices],
      from: deployer,
      ...COMMON_DEPLOY_PARAMS,
      contract: "MockPyth",
    });
    console.log(`MockPyth Deploy arg:`,priceIds, prices);

  return true;
};

// This script can only be run successfully once per market, core version, and network
func.id = `MockPyth:${MARKET_NAME}:aave-v3-core@${V3_CORE_VERSION}`;

func.tags = ["market", "init-testnet", "price-pyth-setup"];

func.dependencies = ["before-deploy", "tokens-setup", "periphery-pre"];

func.skip = async () => checkRequiredEnvironment();

export default func;
