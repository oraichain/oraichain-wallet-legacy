import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "src/store";
import SignIn from "src/components/SignIn/SignIn";
import MainLayout from "src/components/MainLayout";
import Home from "src/components/Home";
import SendTokens from "src/components/SendTokens";
import ImportWallet from "./components/ImportWallet";
import ImportPrivateKey from "./components/ImportPrivateKey";
import CreateWallet from "./components/CreateWallet";
import Cosmos from "@oraichain/cosmosjs";
import { networks } from "./config";

const url = new window.URL(window.location.href);
const network =
  url.searchParams.get('payload') ||
  window.localStorage.getItem('wallet.network') ||
  'Oraichain';
const path = url.searchParams.get('path');
const lcd = url.searchParams.get('lcd') || process.env.REACT_APP_LCD || (networks[network]?.lcd ?? 'http://localhost:1317');
// init cosmos version
const cosmos = new Cosmos(lcd, network);
const symbol = networks[network]?.denom ?? 'orai';
cosmos.setBech32MainPrefix(symbol);
if (path && path !== 'undefined') {
  cosmos.setPath(path);
}

// global params
window.cosmos = cosmos;
window.localStorage.setItem('wallet.network', network);

const App = ({ }) => {
  let persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Switch>
            <Route path="/signin" component={SignIn} />
            <Route path="/create-wallet">
                <CreateWallet />
            </Route>
            <Route path="/import-wallet">
                <ImportWallet />
            </Route>
            <Route path="/import-private-key">
                <ImportPrivateKey />
            </Route>
            <Route path="/send-tokens">
              <MainLayout>
                <SendTokens />
              </MainLayout>
            </Route>
            <Route path="/">
              <MainLayout>
                <Home />
              </MainLayout>
            </Route>
          </Switch>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
