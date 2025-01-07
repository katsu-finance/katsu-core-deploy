import { eStoryNetwork, IAaveConfiguration,eEthereumNetwork } from "./../../helpers/types";
import AaveMarket from "../aave";
import { ZERO_ADDRESS,DEFAULT_PYTH_ID } from "../../helpers";
import {
  strategyDAI,
  strategyUSDC,
  strategyLINK,
  strategyWBTC,
  strategyWIP,
  strategyUSDT,
  strategyAAVE,
  strategyEURS,
  strategyWETH,
} from "./reservesConfigs";
import { CommonsConfig } from "./commons";

export const StoryConfig: IAaveConfiguration = {
  ...CommonsConfig,
  MarketId: "Katsu Market",
  WrappedNativeTokenSymbol: "WIP",
  ATokenNamePrefix: "Katsu",
  StableDebtTokenNamePrefix: "Katsu",
  VariableDebtTokenNamePrefix: "Katsu",
  SymbolPrefix: "Story",
  ProviderId: 36,
  ReservesConfig: {
    DAI: strategyDAI,
    LINK: strategyLINK,
    USDC: strategyUSDC,
    WBTC: strategyWBTC,
    WIP: strategyWIP,
    USDT: strategyUSDT,
    AAVE: strategyAAVE,
    EURS: strategyEURS,
    WETH: strategyWETH,
  },
  ReserveAssets: {
    [eStoryNetwork.story]: {
      DAI: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      LINK: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
      USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      WBTC: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      WIP: "0x1516000000000000000000000000000000000000",
      USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      AAVE: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
      EURS: "0xD22a58f79e9481D1a88e00c343885A588b34b68B",
    },
    [eStoryNetwork.storyTestnet]: {
      DAI: ZERO_ADDRESS,
      LINK: ZERO_ADDRESS,
      USDC: ZERO_ADDRESS,
      WBTC: ZERO_ADDRESS,
      WIP: ZERO_ADDRESS,
      USDT: ZERO_ADDRESS,
      AAVE: ZERO_ADDRESS,
      EURS: ZERO_ADDRESS,
      WETH: ZERO_ADDRESS,
      IP: ZERO_ADDRESS,
    },
  },
  
  PriceId: {
    // [eStoryNetwork.storyTestnet]: {
    [eEthereumNetwork.hardhat]: {
      AAVE: '0x0000000000000000000000000000000000000000000000000000000000000001',
      DAI: '0x0000000000000000000000000000000000000000000000000000000000000002',
      LINK: '0x0000000000000000000000000000000000000000000000000000000000000003',
      USDC: '0x0000000000000000000000000000000000000000000000000000000000000004',
      WBTC: '0x0000000000000000000000000000000000000000000000000000000000000005',
      WIP: '0x0000000000000000000000000000000000000000000000000000000000000006',
      USDT: '0x0000000000000000000000000000000000000000000000000000000000000007',
      // Note: EUR/USD, not EURS dedicated oracle
      EURS: '0x0000000000000000000000000000000000000000000000000000000000000008',
      WETH: '0x0000000000000000000000000000000000000000000000000000000000000009',
      IP: '0x0000000000000000000000000000000000000000000000000000000000000010',
    },
    // Add other networks as needed
  },
  FlashLoanPremiums: {
    total: 0.0009e4,
    protocol: 0,
  },
  
};

export default StoryConfig;
