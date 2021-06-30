import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import _ from "lodash";
// import { Route, Redirect, Switch, useLocation, useRouteMatch, useHistory } from 'react-router';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import { ToastProvider } from 'react-toast-notifications';
import * as yup from "yup";
import store from "src/store";
import Cosmos from "@oraichain/cosmosjs";
import { networks } from "src/config";
import { pagePaths } from "src/consts/pagePaths";
import SignInContainer from "src/containers/SignInContainer";
import UnauthenticatedRoute from "src/containers/UnauthenticatedRoute";
import AuthenticatedRoute from "src/containers/AuthenticatedRoute";
import AuthContainer from "src/containers/AuthContainer";
import SendTokensContainer from "src/containers/SendTokensContainer";
import AlertBoxContainer from "src/containers/AlertBoxContainer";
import TransactionContainer from "src/containers/TransactionContainer";
import ConfirmTransactionContainer from "./containers/ConfirmTransactionContainer";
import SetRequestContainer from "src/containers/SetRequestContainer";
import GetRequestContainer from "src/containers/GetRequestContainer";
import SecurityContainer from "src/containers/SecurityContainer";
import NotFoundContainer from "src/containers/NotFoundContainer";
import Home from "src/components/Home";
import CreateWallet from "src/components/CreateWallet";
import ImportWalletWithMnemonics from "src/components/ImportWalletWithMnemonics";
import ImportWalletWithEncryptedMnemonics from "./components/ImportWalletWithEncryptedMnemonics";
import ImportWalletWithPrivateKey from "src/components/ImportWalletWithPrivateKey";
import "./App.css";

const url = new window.URL(window.location.href);
const network =
    url.searchParams.get("network") ||
    process.env.REACT_APP_NETWORK ||
    window.localStorage.getItem("wallet.network") ||
    "Oraichain";
const path = url.searchParams.get("path");
const lcd = url.searchParams.get("lcd") || process.env.REACT_APP_LCD ||  (networks[network]?.lcd ?? "http://localhost:1317");
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
        message: _.isNil(message) ? "Value must be a number." : message,
        test(value) {
            return !isNaN(value);
        },
    });
});

yup.addMethod(yup.string, "isJSON", function (message) {
    return this.test({
        name: "isJSON",
        exclusive: false,
        message: _.isNil(message) ? "Value must be JSON." : message,
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

yup.addMethod(yup.string, "isPrivateKey", function (message) {
    return this.test({
        name: "isPrivateKey",
        exclusive: false,
        message: _.isNil(message) ? "Value must be private key." : message,
        test(value) {
            return value.length === 60 + cosmos.bech32MainPrefix.length;
        },
    });
});

const App = ({ }) => {
    let persistor = persistStore(store);

    return (
        <Provider store={store}>
            <ToastProvider>
                <PersistGate loading={null} persistor={persistor}>
                    <Router>
                        <Switch>
                            <Route path={pagePaths.AUTH} component={AuthContainer} />
                            <UnauthenticatedRoute
                                exact
                                path={pagePaths.SIGNIN}
                                component={SignInContainer} />
                            <UnauthenticatedRoute
                                exact
                                path={pagePaths.CREATE_WALLET}
                                component={CreateWallet}
                            />
                            <UnauthenticatedRoute
                                exact
                                path={pagePaths.IMPORT_WALLET_WITH_MNEMONICS}
                                component={ImportWalletWithMnemonics}
                            />
                            <UnauthenticatedRoute
                                exact
                                path={pagePaths.IMPORT_WALLET_WITH_ENCRYPTED_MNEMONICS}
                                component={ImportWalletWithEncryptedMnemonics}
                            />
                            <UnauthenticatedRoute
                                exact
                                path={pagePaths.IMPORT_WALLET_WITH_PRIVATE_KEY}
                                component={ImportWalletWithPrivateKey}
                            />
                            <AuthenticatedRoute
                                exact
                                path={pagePaths.TX}
                                component={TransactionContainer} />
                            <AuthenticatedRoute
                                exact
                                path={pagePaths.TRANSACTION}
                                component={TransactionContainer} />
                            <AuthenticatedRoute
                                exact
                                path={pagePaths.CONFIRM_TX}
                                component={ConfirmTransactionContainer} />
                            <AuthenticatedRoute exact path={pagePaths.SEND_TOKENS}>
                                <SendTokensContainer />
                            </AuthenticatedRoute>
                            <AuthenticatedRoute exact path={pagePaths.AI_REQUEST_SET}>
                                <SetRequestContainer />
                            </AuthenticatedRoute>
                            <AuthenticatedRoute exact path={pagePaths.AI_REQUEST_GET}>
                                <GetRequestContainer />
                            </AuthenticatedRoute>
                            <AuthenticatedRoute exact path={pagePaths.SECURITY}>
                                <SecurityContainer />
                            </AuthenticatedRoute>
                            <AuthenticatedRoute exact path={pagePaths.HOME}>
                                <Home />
                            </AuthenticatedRoute>
                            <Route path="*">
                                <NotFoundContainer />
                            </Route>
                        </Switch>
                    </Router>
                    <AlertBoxContainer />
                </PersistGate>
            </ToastProvider>
        </Provider>
    );
};

export default App;
