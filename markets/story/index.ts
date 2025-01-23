import { eEthereumNetwork, eStoryNetwork, IAaveConfiguration,
  TransferStrategy,
  AssetType, } from "./../../helpers/types";
import { ZERO_ADDRESS } from "../../helpers";
import {
  strategyDAI,
  strategyUSDC,
  strategyWBTC,
  strategyWIP,
  strategyUSDT,
  strategyWETH,
} from "./reservesConfigs";
import {
  rateStrategyStableOne,
  rateStrategyStableTwo,
  rateStrategyVolatileOne,
} from "./rateStrategies";
import { AaveMarket } from "../aave/index";

export const StoryConfig: IAaveConfiguration = {
  ...AaveMarket,
  MarketId: "Katsu Market",
  WrappedNativeTokenSymbol: "WIP",
  ATokenNamePrefix: "Katsu",
  StableDebtTokenNamePrefix: "Katsu",
  VariableDebtTokenNamePrefix: "Katsu",
  SymbolPrefix: "Katsu",
  ReserveFactorTreasuryAddress: {},
  ReservesConfig: {
    DAI: strategyDAI,
    USDC: strategyUSDC,
    WBTC: strategyWBTC,
    WIP: strategyWIP,
    USDT: strategyUSDT,
    WETH: strategyWETH,
  },
  ChainlinkAggregator: {
    [eStoryNetwork.story]: {
      USDC: ZERO_ADDRESS,
      DAI: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
    },
  },
  ReserveAssets: {
    [eStoryNetwork.story]: {
      DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      WBTC: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      WIP: "0x1516000000000000000000000000000000000000",
      USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    },
    [eStoryNetwork.storyTestnet]: {
      DAI: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WIP: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      IP: ZERO_ADDRESS,
    },
  },
  EModes: {},
  FlashLoanPremiums: {
    total: 0.0009e4,
    protocol: 0,
  },
  RateStrategies: {
    rateStrategyVolatileOne,
    rateStrategyStableOne,
    rateStrategyStableTwo,
  },
  IncentivesConfig: {
    enabled: {
      [eEthereumNetwork.hardhat]: true,
      [eStoryNetwork.storyTestnet]: true,
    },
    rewards: {
      [eEthereumNetwork.hardhat]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
        StkAave: ZERO_ADDRESS,
      },
      [eStoryNetwork.storyTestnet]: {
        CRV: ZERO_ADDRESS,
        REW: ZERO_ADDRESS,
        BAL: ZERO_ADDRESS,
      }
    },
    rewardsOracle: {
      // [eStoryNetwork.storyTestnet]: {
      //   CRV: ZERO_ADDRESS,
      //   REW: ZERO_ADDRESS,
      //   BAL: ZERO_ADDRESS,
      // },
    },
    incentivesInput: {
      // [eStoryNetwork.storyTestnet]: [
      //   {
      //     emissionPerSecond: "34629756533",
      //     duration: 7890000,
      //     asset: "DAI",
      //     assetType: AssetType.AToken,
      //     reward: "CRV",
      //     rewardOracle: "0",
      //     transferStrategy: TransferStrategy.PullRewardsStrategy,
      //     transferStrategyParams: "0",
      //   },
      //   {
      //     emissionPerSecond: "300801036720127500",
      //     duration: 7890000,
      //     asset: "USDC",
      //     assetType: AssetType.AToken,
      //     reward: "REW",
      //     rewardOracle: "0",
      //     transferStrategy: TransferStrategy.PullRewardsStrategy,
      //     transferStrategyParams: "0",
      //   },
      //   {
      //     emissionPerSecond: "300801036720127500",
      //     duration: 7890000,
      //     asset: "WIP",
      //     assetType: AssetType.AToken,
      //     reward: "REW",
      //     rewardOracle: "0",
      //     transferStrategy: TransferStrategy.PullRewardsStrategy,
      //     transferStrategyParams: "0",
      //   },
      // ],
    },
  },
};

export default StoryConfig;
