import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
// import { Route, Redirect, Switch, useLocation, useRouteMatch, useHistory } from 'react-router';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider, useSelector } from "react-redux";
import store from "src/store";
import SignIn from "src/containers/SignIn";
import MainLayout from "src/components/MainLayout";
import Home from "src/components/Home";
import SendTokens from "src/components/SendTokens";
import ImportWallet from "src/components/ImportWallet";
import CreateWallet from "src/components/CreateWallet";
import Transaction from 'src/components/Transaction';
import Cosmos from "@oraichain/cosmosjs";
import { networks } from "./config";

const url = new window.URL(window.location.href);
const network =
  url.searchParams.get('network') ||
  window.localStorage.getItem('wallet.network') ||
  'Oraichain';
const path = url.searchParams.get('path');
const lcd = url.searchParams.get('lcd') || process.env.REACT_APP_LCD || (networks[network]?.lcd ?? 'http://localhost:1317');
// init cosmos version
const cosmos = new Cosmos(lcd, 'Oraichain');
const symbol = networks[network]?.denom ?? 'orai';
cosmos.setBech32MainPrefix(symbol);
// if (path && path !== 'undefined') {
//   cosmos.setPath(path);
// }

// global params
window.cosmos = cosmos;
window.localStorage.setItem('wallet.network', network);

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  return <Route {...rest} render={(props) => (isLoggedIn ? <Component {...props} /> : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />)} />;
};

const App = ({ }) => {
  const user = useSelector(state => state.user);
  let persistor = persistStore(store);
  const match = useRouteMatch();
  const isLoggedIn = !!user;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Switch>
            <Route path="/signin" component={SignIn} />
            <Route path="/create-wallet" component={CreateWallet} />
            <Route path="/import-wallet" component={ImportWallet} />
            <PrivateRoute isLoggedIn={isLoggedIn} path={`/tx`} component={Transaction} />
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
