import { createSlice } from "@reduxjs/toolkit";
import DocumentIcon from "src/components/icons/DocumentIcon";
import ActiveDocumentIcon from "src/components/icons/ActiveDocumentIcon";
import GraphIcon from "src/components/icons/GraphIcon";
import ActiveGraphIcon from "src/components/icons/ActiveGraphIcon";
import ChartIcon from "src/components/icons/ChartIcon";
import ActiveChartIcon from "src/components/icons/ActiveChartIcon";
import SettingIcon from "src/components/icons/SettingIcon";
import ActiveSettingIcon from "src/components/icons/ActiveSettingIcon";

export const userSlice = createSlice({
    name: "user",
    initialState: {},
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        },
        removeUser: (state, action) => {
            return {};
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
