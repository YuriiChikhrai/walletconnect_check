import { FC, useEffect, useMemo, useState } from "react";

import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { bsc, goerli, mainnet } from "wagmi/chains";

import { CryptoContextProvider } from "./CryptoContextProvider";

const chains = [mainnet, bsc, goerli];

const wallet_connect = {
  id: process.env.WC_ID,
  // https://explorer.walletconnect.com/?type=wallet
  wallets: [
    // Trust
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
    // MetaMask
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
    // Binance
    "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4",
    // Rainbow
    "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
    // Phantom
    "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
    // Coinbase
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
  ],
};

export const CryptoContext: FC = ({ children }) => {
  const [wcVersion, setWcVersion] = useState<1 | 2>(parseInt(localStorage.getItem("wcVersion") || "1") as 1 | 2);

  const { wagmiConfig, ethereumClient } = useMemo(() => {
    if (!wallet_connect?.id) {
      // TODO: create mock
      return { wagmiConfig: null, ethereumClient: null };
    }

    const { publicClient } = configureChains(chains, [w3mProvider({ projectId: wallet_connect.id })]);
    const wagmiConfig = createConfig({
      autoConnect: true,
      connectors: w3mConnectors({ projectId: wallet_connect.id, version: wcVersion, chains }),
      publicClient,
    });
    const ethereumClient = new EthereumClient(wagmiConfig, chains);

    return { wagmiConfig, ethereumClient };
  }, [wallet_connect, wcVersion]);

  useEffect(() => {
    localStorage.setItem("wcVersion", `${wcVersion}`);
  }, [wcVersion]);

  if (!wagmiConfig || !ethereumClient) return <>{children}</>;

  return (
    <CryptoContextProvider.Provider value={{ wcVersion, setWcVersion }}>
      {!wallet_connect?.id || !ethereumClient ? (
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      ) : (
        <>
          <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>

          <Web3Modal
            projectId={wallet_connect.id}
            enableNetworkView={false}
            ethereumClient={ethereumClient}
            defaultChain={mainnet}
            explorerRecommendedWalletIds={wallet_connect.wallets}
            explorerExcludedWalletIds="ALL"
          />
        </>
      )}
    </CryptoContextProvider.Provider>
  );
};
