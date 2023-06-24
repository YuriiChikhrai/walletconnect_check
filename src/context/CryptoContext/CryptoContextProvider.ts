import { createContext } from "react";

import { Chain } from "viem";
import { mainnet } from "wagmi/chains";

export const CryptoContextProvider = createContext<{
  wcVersion: 1 | 2;
  setWcVersion: (version: 1 | 2) => void;
  chain: Chain;
  chains: Array<Chain>;
  setChain: (chain: Chain) => void;
}>({
  wcVersion: 1,
  setWcVersion: () => {},
  chain: mainnet,
  chains: [mainnet],
  setChain: () => {},
});
