import React from "react";
import "./polyfills";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MoralisProvider } from "react-moralis";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MoralisProvider initializeOnMount={false}>
    <App />
  </MoralisProvider>
);
