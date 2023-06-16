import { FC, memo, useEffect, useRef } from "react";

import { fetchTransaction } from "@wagmi/core";
import { useAccount, usePrepareSendTransaction, useSendTransaction } from "wagmi";

export const CryptoSendTransaction: FC<{ to: string; value: bigint; startTime: number; chainId: number }> = memo(
  ({ to, value, startTime, chainId }) => {
    const startTimeRef = useRef<number | undefined>();
    const { address } = useAccount();

    const { config } = usePrepareSendTransaction({
      to,
      value,
      gas: BigInt(100000),
      chainId,
    });

    const { sendTransactionAsync, reset } = useSendTransaction(config);

    useEffect(() => {
      if (sendTransactionAsync && value && startTimeRef.current !== startTime) {
        reset();

        startTimeRef.current = startTime;

        sendTransactionAsync()
          .then(async ({ hash }) => {
            debugger;
            const transaction = await fetchTransaction({
              hash,
            });
            if (!transaction) {
              return;
            }

            debugger;
          })
          .catch((e) => {
            debugger;
            // 4001 when use browser extension / -32000 when use mobile wallet connect
            if ([4001, -32000].includes(e.code) && address) {
              reset();
              const amount = e.cause?.transaction?.value || value.toString();
              console.log(amount);
              debugger;
            } else {
              console.error(e);
              debugger;
            }
          });
      }
    }, [value, sendTransactionAsync, reset, startTime, address, to]);

    return <></>;
  },
);
