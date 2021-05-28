import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import _ from "lodash";
// import { Route, Redirect, Switch, useLocation, useRouteMatch, useHistory } from 'react-router';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "src/store";
import SignInContainer from "src/containers/SignInContainer";
import PrivateRoute from "src/containers/PrivateRoute";
import AuthContainer from "src/containers/AuthContainer";
import ImportWalletContainer from "src/containers/ImportWalletContainer";
import MainLayout from "src/components/MainLayout";
import Home from "src/components/Home";
import SendTokens from "src/components/SendTokens";
import SetRequest from "src/components/airequest/SetRequest";
import CreateWallet from "src/components/CreateWallet";
import Transaction from "src/components/Transaction";
import Cosmos from "@oraichain/cosmosjs";
import { networks } from "./config";
import { pagePaths } from "./consts/pagePaths";

const url = new window.URL(window.location.href);
const network = url.searchParams.get("network") || window.localStorage.getItem("wallet.network") || "Oraichain";
const path = url.searchParams.get("path");
const lcd = url.searchParams.get("lcd") || process.env.REACT_APP_LCD || (networks[network]?.lcd ?? "http://localhost:1317");
// init cosmos version
const cosmos = new Cosmos(lcd, network);
const symbol = networks[network]?.denom ?? "orai";
cosmos.setBech32MainPrefix(symbol);
// if (path && path !== 'undefined') {
//   cosmos.setPath(path);
// }

// global params
window.cosmos = cosmos;
window.localStorage.setItem("wallet.network", network);


const App = ({ }) => {
    let persistor = persistStore(store);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Switch>
                        <Route path={pagePaths.AUTH} component={AuthContainer} />
                        <Route path={pagePaths.SIGNIN} component={SignInContainer} />
                        <Route path={pagePaths.CREATE_WALLET} component={CreateWallet} />
                        <Route path={pagePaths.IMPORT_WALLET} component={ImportWalletContainer} />
                        <PrivateRoute path={pagePaths.TX} component={Transaction} />
                        <Route path={pagePaths.SEND_TOKENS}>
                            <MainLayout>
                                <SendTokens />
                            </MainLayout>
                        </Route>
                        <Route path={pagePaths.AI_REQUEST_SET}>
                            <MainLayout>
                                <SetRequest />
                            </MainLayout>
                        </Route>
                        <Route path={pagePaths.HOME}>
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
