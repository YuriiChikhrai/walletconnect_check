import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

import { useWeb3Modal } from "@web3modal/react";
import { parseEther } from "viem";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { mainnet } from "wagmi/chains";

export const useTestPage = () => {
  const { open } = useWeb3Modal();
  const { connector, isConnected, isDisconnected, address, isConnecting } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync, reset } = useSignMessage();
  const [message, setMessage] = useState<string>("");
  const [transactionData, setTransactionData] = useState<
    { to: string; amount: bigint; smartContract?: string; startTime: number; chainId: number } | undefined
  >(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickDisconnect = useCallback(() => {
    return disconnectAsync()
      .then(() => {
        console.log("Disconnected.");
        setMessage("");
      })
      .catch((error) => {
        console.error("Disconnect error: ", error);
      });
  }, [disconnectAsync]);

  // Use callback to receive actual WC state from LocalStorage
  const connectedWalletName = useCallback(() => {
    let wallet = connector?.name?.toLowerCase() || "";

    const clientSettings = localStorage.getItem("walletconnect");
    if (clientSettings) {
      try {
        const meta = JSON.parse(clientSettings)?.peerMeta;
        const walletName = meta?.name?.toLowerCase() || "";
        wallet = walletName.includes("trust") ? "trust" : walletName.includes("metamask") ? "metamask" : walletName;
      } catch (e) {}
    }

    return wallet;
  }, [connector]);

  const handleClickLogin = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      open();
    },
    [open],
  );

  const handleClickSign = useCallback(async () => {
    if (message) {
      let signedMessage;
      try {
        signedMessage = await signMessageAsync({ message });
        alert(`Message signed successfully.\n\nMessage: ${signedMessage}`);
      } catch (error) {
        alert("Message sign error or reject!");
        console.error(error);
        debugger;
      }
    }
  }, [message]);

  const prepareDataForTransaction = useCallback(async (value: `${number}`, smartContract?: string) => {
    const to = inputRef.current?.value;
    if (!to) {
      alert("Please enter a valid address");
      return;
    }

    const amount = smartContract ? BigInt(value) : parseEther(value);

    setTransactionData({
      to,
      amount,
      smartContract,
      startTime: Date.now(),
      chainId: mainnet.id,
    });
  }, []);

  const handleClickSendGWei = useCallback(() => {
    alert("Try send 10 gwei");
    prepareDataForTransaction("0.00000001");
  }, []);

  const handleClickSendTokens = useCallback(() => {
    alert("Try send 0.000001 USDT");
    // USDT
    const tokenAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";
    prepareDataForTransaction("1", tokenAddress);
  }, []);

  const getSignMessage = useCallback(async (address: string) => {
    const message = await new Promise<string>((resolve) => {
      setTimeout(
        () => resolve(`Your account: ${address}.\nPlease, sign this message.\nTimestamp: ${new Date().toISOString()}`),
        1000,
      );
    });
    if (message) {
      setMessage(message);
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      getSignMessage(address);
      close();
    }
  }, [close, isConnected, address, connectedWalletName]);

  return {
    handleClickDisconnect,
    handleClickLogin,
    handleClickSign,
    handleClickSendGWei,
    handleClickSendTokens,
    inputRef,
    isConnected,
    isConnecting,
    isDisconnected,
    showSignMessageButton: !!message,
    transactionData,
  };
};
