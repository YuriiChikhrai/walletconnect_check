import { FC, useContext } from "react";

import { CryptoSendTokens } from "../../components/CryptoSendTokens";
import { CryptoSendTransaction } from "../../components/CryptoSendTransaction";
import { CryptoContextProvider } from "../../context/CryptoContext/CryptoContextProvider";
import { useTestPage } from "./useTestPage";

import "./test-page.css";

export const TestPage: FC = () => {
  const { wcVersion, setWcVersion } = useContext(CryptoContextProvider);
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

      <label htmlFor="wc-version-select">Choose version:</label>
      <select
        id="wc-version-select"
        onChange={(e) => {
          const version = parseInt(e.currentTarget.value) as 1 | 2;
          handleClickDisconnect().finally(() => {
            setWcVersion(version);
            setTimeout(() => {
              window.location.reload();
            }, 0);
          });
        }}
        value={wcVersion}
      >
        <option value={1}>1</option>
        <option value={2}>2</option>
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
                <button onClick={handleClickSendTokens}>Check send 0.000001 USDT</button>
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
    </div>
  );
};
