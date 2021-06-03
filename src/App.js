import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import _ from "lodash";
// import { Route, Redirect, Switch, useLocation, useRouteMatch, useHistory } from 'react-router';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import * as yup from "yup";
import store from "src/store";
import Cosmos from "@oraichain/cosmosjs";
import { networks } from "src/config";
import { pagePaths } from "src/consts/pagePaths";
import SignInContainer from "src/containers/SignInContainer";
import UnauthenticatedRoute from "src/containers/UnauthenticatedRoute";
import AuthenticatedRoute from "src/containers/AuthenticatedRoute";
import AuthContainer from "src/containers/AuthContainer";
import ImportWalletContainer from "src/containers/ImportWalletContainer";
import SendTokensContainer from "src/containers/SendTokensContainer";
import AlertBoxContainer from "src/containers/AlertBoxContainer";
import TransactionContainer from "src/containers/TransactionContainer";
import SetRequestContainer from "src/containers/SetRequestContainer";
import NotFoundContainer from "src/containers/NotFoundContainer";
import Home from "src/components/Home";
import GenerateMnemonics from "src/components/GenerateMnemonics";
import SetRequest from "src/components/airequest/SetRequest";
import MainLayout from "src/components/MainLayout";

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

yup.addMethod(yup.string, "isNumeric", function (message) {
    return this.test({
        name: "isNumeric",
        exclusive: false,
        message: _.isNil(message) ? "Value must be a number" : message,
        test(value) {
            return !isNaN(value);
        },
    });
});

yup.addMethod(yup.string, "isJSON", function (message) {
    return this.test({
        name: "isJSON",
        exclusive: false,
        message: _.isNil(message) ? "Value must be JSON" : message,
        test(value) {
            try {
                JSON.parse(value);
            } catch (e) {
                return false;
            }
            return true;
        },
    });
});

const App = ({}) => {
    let persistor = persistStore(store);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Switch>
                        <UnauthenticatedRoute exact path={pagePaths.SIGNIN} component={SignInContainer} />
                        <UnauthenticatedRoute exact path={pagePaths.GENERATE_MNEMONICS} component={GenerateMnemonics} />
                        <UnauthenticatedRoute exact path={pagePaths.IMPORT_WALLET} component={ImportWalletContainer} />
                        <AuthenticatedRoute exact path={pagePaths.TX} component={TransactionContainer} />
                        <AuthenticatedRoute exact path={pagePaths.SEND_TOKENS}>
                            <SendTokensContainer />
                        </AuthenticatedRoute>
                        <AuthenticatedRoute exact path={pagePaths.AI_REQUEST_SET}>
                            <SetRequestContainer />
                        </AuthenticatedRoute>
                        <AuthenticatedRoute exact path={"/test"}>
                            <MainLayout>
                                <SetRequest />
                            </MainLayout>
                        </AuthenticatedRoute>
                        <AuthenticatedRoute exact path={pagePaths.HOME}>
                            <Home />
                        </AuthenticatedRoute>
                        <Route exact path={pagePaths.AUTH} component={AuthContainer} />
                        <Route exact path="*">
                            <NotFoundContainer />
                        </Route>
                    </Switch>
                </Router>
                <AlertBoxContainer />
            </PersistGate>
        </Provider>
    );
};

export default App;
