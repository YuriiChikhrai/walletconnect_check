import { AppContainer } from "react-hot-loader";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AppContainer>
      <App />
    </AppContainer>
  </React.StrictMode>,
  document.querySelector("body"),
);

