import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "src/store";
import AuthLayout from "src/components/AuthLayout";
import SignIn from "src/components/SignIn/SignIn";
import MainLayout from "src/components/MainLayout";
import Home from "src/components/Home";
import SendTokens from "src/components/SendTokens";
import ImportWallet from "./components/ImportWallet";
import ImportPrivateKey from "./components/ImportPrivateKey";
import CreateWallet from "./components/CreateWallet";

const App = ({ }) => {
  let persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Switch>
            <Route path="/signin">
              <AuthLayout>
                <SignIn />
              </AuthLayout>
            </Route>
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
