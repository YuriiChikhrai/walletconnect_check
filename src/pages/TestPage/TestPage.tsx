import { FC, useContext } from "react";

import { CryptoSendTokens } from "../../components/CryptoSendTokens";
import { CryptoSendTransaction } from "../../components/CryptoSendTransaction";
import { CryptoContextProvider } from "../../context/CryptoContext/CryptoContextProvider";
import { useTestPage } from "./useTestPage";

import "./test-page.css";

export const TestPage: FC = () => {
  const { chain, chains, setChain } = useContext(CryptoContextProvider);
  const {
    handleClickDisconnect,
    handleClickLogin,
    handleClickSign,
    handleClickSendTokens,
    handleClickSendGWei,
    inputRef,
    isConnected,
    isDisconnected,
    isConnecting,
    showSignMessageButton,
    transactionData,
  } = useTestPage();

  return (
    <div className="test-page">
      <h2>WalletConnect checker</h2>

      <label htmlFor="wc-chain-select">Choose chain:</label>
      <select
        id="wc-chain-select"
        onChange={(e) => {
          const selectedChain = parseInt(e.currentTarget.value);

          handleClickDisconnect().finally(() => {
            setChain(chains.find(({ id }) => id === selectedChain) || chains[0]);
            setTimeout(() => {
              window.location.reload();
            }, 0);
          });
        }}
        value={chain.id}
      >
        {chains.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>

      {transactionData?.smartContract ? (
        <CryptoSendTokens
          value={transactionData.amount}
          to={transactionData.to}
          contract={transactionData.smartContract}
          startTime={transactionData.startTime}
          chainId={transactionData.chainId}
        />
      ) : (
        transactionData && (
          <CryptoSendTransaction
            value={transactionData.amount}
            to={transactionData.to}
            startTime={transactionData.startTime}
            chainId={transactionData.chainId}
          />
        )
      )}

      {isConnecting && !isDisconnected ? (
        <>
          <span>Connecting...</span>
        </>
      ) : (
        <div className="test-page__mt">
          {showSignMessageButton ? (
            <>
              <button onClick={handleClickSign}>Check message sign</button>

              <div className="test-page__sender">
                <label htmlFor="address">Address:</label>
                <input
                  id="address"
                  type="text"
                  placeholder="Please enter address to check send eth/tokens"
                  defaultValue={process.env.WALLET_ADDRESS || ""}
                  ref={inputRef}
                />
                <button onClick={handleClickSendGWei}>Check send 10 gwei</button>
                <button onClick={handleClickSendTokens}>Check send 1 {chain.id === 1 ? "USDT" : "LINK"}</button>
              </div>
            </>
          ) : (
            <button onClick={handleClickLogin}>Login</button>
          )}

          {isConnected && (
            <button onClick={handleClickDisconnect} className="test-page__mt">
              Disconnect
            </button>
          )}
        </div>
      )}

      <div className="test-page__quote">
        <span>Versions:</span>
        <ul>
          <li>viem: {process.env.VERSION_VIEM}</li>
          <li>wagmi: {process.env.VERSION_WAGMI}</li>
          <li>walletconnect: {process.env.VERSION_WC}</li>
        </ul>
      </div>
    </div>
  );
};
