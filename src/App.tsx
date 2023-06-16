import { hot } from "react-hot-loader/root";

import { FC } from "react";

import { CryptoContext } from "./context/CryptoContext";
import { TestPage } from "./pages/TestPage";

import "./App.css";

const App: FC = () => {
  return (
    <div className="App">
      <CryptoContext>
        <TestPage />
      </CryptoContext>
    </div>
  );
};

export default hot(App);
