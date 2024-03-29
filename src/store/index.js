import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import menuSlice from "src/store/slices/menuSlice";
import userSlice from "src/store/slices/userSlice";
import alertSlice from "src/store/slices/alertSlice";
import contractSlice from "src/store/slices/contractSlice";
import requestSlice from "src/store/slices/requestSlice";

const reducers = combineReducers({
    menu: menuSlice,
    user: userSlice,
    alert: alertSlice,
    contract: contractSlice,
    request: requestSlice,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: [thunk],
});

export default store;
