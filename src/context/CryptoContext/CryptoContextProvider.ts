import { createContext } from "react";

export const CryptoContextProvider = createContext<{
  wcVersion: 1 | 2;
  setWcVersion: (version: 1 | 2) => void;
}>({
  wcVersion: 1,
  setWcVersion: () => {},
});
