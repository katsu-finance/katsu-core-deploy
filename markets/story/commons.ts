import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  ICommonConfiguration,
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
      USDC: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
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
