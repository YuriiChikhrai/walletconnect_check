import { createContext } from "react";

import { Chain } from "viem";
import { mainnet } from "wagmi/chains";

export const CryptoContextProvider = createContext<{
  chain: Chain;
  chains: Array<Chain>;
  setChain: (chain: Chain) => void;
}>({
  chain: mainnet,
  chains: [mainnet],
  setChain: () => {},
});
