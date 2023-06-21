import { FC, memo, useEffect, useRef } from "react";

import { fetchToken } from "@wagmi/core";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import { usdtContract } from "./contract";

export const CryptoSendTokens: FC<{
  to: string;
  value: bigint;
  contract: string;
  startTime: number;
  chainId: number;
}> = memo(({ to, value, contract, startTime, chainId }) => {
  const startTimeRef = useRef<number | undefined>();
  const { address } = useAccount();

  const { config } = usePrepareContractWrite({
    ...usdtContract,
    chainId,
    args: [to as `0x${string}`, value],
    functionName: "transfer",
  });

  const { writeAsync, reset } = useContractWrite(config);

  useEffect(() => {
    if (writeAsync && value && startTimeRef.current !== startTime) {
      reset();

      startTimeRef.current = startTime;

      writeAsync()
        .then(async ({ hash }) => {
          alert(`Transaction successful: ${hash}`);
        })
        .catch(async (e) => {
          // 4001 when use browser extension / -32000 when use mobile wallet connect
          if ([4001, -32000].includes(e.code) && address) {
            reset();

            try {
              const token = await fetchToken({
                address: contract as `0x${string}`,
              });
              console.log(token);
              debugger;
            } catch (err) {}
          } else {
            console.error(e);
            debugger;
          }
        });
    }
  }, [value, writeAsync, reset, startTime, config, address]);

  return <></>;
});
