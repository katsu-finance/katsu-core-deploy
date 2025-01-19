import {
  isTestnetMarket,
  loadPoolConfig,
} from "./../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MARKET_NAME } from "../helpers/env";
import { getPoolConfiguratorProxy, waitForTx, getAaveOracle, getMintableERC20,getPyth} from "../helpers";

/**
 * The following script runs after the deployment starts
 */

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  console.log("=== Post deployment hook ===");
  const poolConfig = loadPoolConfig(MARKET_NAME);

  console.log("- Enable stable borrow in selected assets");
  await hre.run("review-stable-borrow", { fix: true, vvv: true });

  console.log("- Review rate strategies");
  await hre.run("review-rate-strategies");

  console.log("- Setup Debt Ceiling");
  await hre.run("setup-debt-ceiling");

  console.log("- Setup Borrowable assets in Isolation Mode");
  await hre.run("setup-isolation-mode");

  console.log("- Setup E-Modes");
  await hre.run("setup-e-modes");

  console.log("- Setup Liquidation protocol fee");
  await hre.run("setup-liquidation-protocol-fee");

  if (isTestnetMarket(poolConfig)) {
    // Disable faucet minting and borrowing of wrapped native token
    await hre.run("disable-faucet-native-testnets");
    console.log("- Minting and borrowing of wrapped native token disabled");

    // Unpause pool
    const poolConfigurator = await getPoolConfiguratorProxy();
    await waitForTx(await poolConfigurator.setPoolPause(false));
    console.log("- Pool unpaused and accepting deposits.");

    const aaveOracle = await getAaveOracle();
    const wipToken = await getMintableERC20((await deployments.get("WIP-TestnetMintableERC20-story")).address);
    const daiToken = await getMintableERC20((await deployments.get("DAI-TestnetMintableERC20-story")).address);
    const daiAToken = await getMintableERC20((await deployments.get("DAI-AToken-story")).address);
    const decimal = await daiAToken.decimals();
    console.log("daiAToken decimal:",decimal);
    const pyth = await getPyth();

    const daiPrice = await pyth.getPriceNoOlderThan('0x0000000000000000000000000000000000000000000000000000000000000001',60);
    const ipPrice = await pyth.getPriceNoOlderThan('0x0000000000000000000000000000000000000000000000000000000000000007',60);
    console.log("dai price:",daiPrice);
    console.log("ip price:",ipPrice);
    console.log("pyth address",pyth.address);

    console.log("dai price",daiToken.address);
    console.log("aaveOracle address", aaveOracle.address)
    console.log("dai price",await aaveOracle.getAssetPrice(daiToken.address));
    console.log("wip price",await aaveOracle.getAssetPrice(wipToken.address));
    console.log("ip price",await aaveOracle.getAssetPrice("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"));
    console.log("fallbackOracle",await aaveOracle.getFallbackOracle());
  }

  if (process.env.TRANSFER_OWNERSHIP === "true") {
    await hre.run("transfer-protocol-ownership");
    await hre.run("renounce-pool-admin");
    await hre.run("view-protocol-roles");
  }

  await hre.run("print-deployments");
};

func.tags = ["after-deploy"];
func.runAtTheEnd = true;
export default func;
