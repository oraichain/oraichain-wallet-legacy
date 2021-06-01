import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import _ from "lodash";
// import { Route, Redirect, Switch, useLocation, useRouteMatch, useHistory } from 'react-router';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "src/store";
import Cosmos from "@oraichain/cosmosjs";
import { networks } from "src/config";
import { pagePaths } from "src/consts/pagePaths";
import SignInContainer from "src/containers/SignInContainer";
import UnauthenticatedRoute from "src/containers/UnauthenticatedRoute";
import AuthenticatedRoute from "src/containers/AuthenticatedRoute";
import AuthContainer from "src/containers/AuthContainer";
import ImportWalletContainer from "src/containers/ImportWalletContainer";
import MainLayout from "src/components/MainLayout";
import Home from "src/components/Home";
import SetRequest from "src/components/airequest/SetRequest";
import GenerateMnemonics from "src/components/GenerateMnemonics";
import Transaction from "src/components/Transaction";
import SendTokensContainer from "./containers/SendTokensContainer";

const url = new window.URL(window.location.href);
const network = url.searchParams.get("network") || window.localStorage.getItem("wallet.network") || "Oraichain";
const path = url.searchParams.get("path");
const lcd =
    process.env.REACT_APP_LCD || url.searchParams.get("lcd") || (networks[network]?.lcd ?? "http://localhost:1317");
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

const App = ({}) => {
    let persistor = persistStore(store);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Switch>
                        <Route path={pagePaths.AUTH} component={AuthContainer} />
                        <UnauthenticatedRoute path={pagePaths.SIGNIN} component={SignInContainer} />
                        <Route path={pagePaths.GENERATE_MNEMONICS} component={GenerateMnemonics} />
                        <Route path={pagePaths.IMPORT_WALLET} component={ImportWalletContainer} />
                        <AuthenticatedRoute path={pagePaths.TX} component={Transaction} />
                        <Route path={pagePaths.SEND_TOKENS}>
                            <SendTokensContainer />
                        </Route>
                        <Route path={pagePaths.AI_REQUEST_SET}>
                            <MainLayout>
                                <SetRequest />
                            </MainLayout>
                        </Route>
                        <Route path={pagePaths.HOME}>
                            <Home />
                        </Route>
                    </Switch>
                </Router>
            </PersistGate>
        </Provider>
    );
};

export default App;