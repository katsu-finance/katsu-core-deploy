import { parseUnits } from "ethers/lib/utils";
import { ZERO_ADDRESS,DEFAULT_PYTH_ID } from "../../helpers/constants";
import {
  ICommonConfiguration,
  eEthereumNetwork,
  eArbitrumNetwork,
  TransferStrategy,
  AssetType,
  eStoryNetwork,
} from "../../helpers/types";
import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyVolatileOne,
} from "./rateStrategies";
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: "Katsu Market",
  WrappedNativeTokenSymbol: "WIP",
  ATokenNamePrefix: "Katsu",
  StableDebtTokenNamePrefix: "Katsu",
  VariableDebtTokenNamePrefix: "Katsu",
  SymbolPrefix: "Katsu",
  ProviderId: 36,
  OracleQuoteCurrencyAddress: ZERO_ADDRESS,
  OracleQuoteCurrency: "USD",
  OracleQuoteUnit: "8",
  ReservesConfig: {},
  IncentivesConfig: {enabled:{}, rewards:{}, rewardsOracle:{}, incentivesInput:{}},
  ReserveFactorTreasuryAddress: {},
  ChainlinkAggregator: {
    [eStoryNetwork.story]: {
      LINK: "0x86E53CF1B870786351Da77A57575e79CB55812CB",
      USDC: "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3",
      DAI: "0xc5C8E77B397E531B8EC06BFb0048328B30E9eCfB",
      WBTC: "0x6ce185860a4963106506C203335A2910413708e9",
      WETH: "0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612",
      USDT: "0x3f3f5dF88dC9F13eac63DF89EC16ef6e7E25DdE7",
      AAVE: "0xaD1d5344AaDE45F43E596773Bcc4c423EAbdD034",
      // Note: Using EUR/USD Chainlink data feed
      EURS: "0xA14d53bC1F1c0F31B4aA3BD109344E5009051a84",
    },
  },
  EModes: {
    StableEMode: {
      id: "1",
      ltv: "9800",
      liquidationThreshold: "9850",
      liquidationBonus: "10100",
      label: "Stable-EMode",
      assets: ["USDC", "DAI"],
    },
  },
  FlashLoanPremiums: {
    total: 0.0009e4,
    protocol: 0,
  },
  RateStrategies: {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
  },
  Pyth: {
    [eStoryNetwork.storyTestnet]:'0x2880aB155794e7179c9eE2e38200202908C17B43',
    [eStoryNetwork.story]:'0xA14d53bC1F1c0F31B4aA3BD109344E5009051a84'
  },
};
