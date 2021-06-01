import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visible: false,
    variant: "success",
    duration: 3000,
    message: "",
    onHide: null,
}

export const alertSlice = createSlice({
    name: "alert",
    initialState: initialState,
    reducers: {
        showAlertBox: (state, action) => {
            state.visible = true;
            state.variant = action.payload.variant;
            state.duration = action.payload?.duration ?? 3000;
            state.message = action.payload.message;
            state.onHide = action.payload?.onHide ?? null;
        },
        hideAlertBox: (state) => {
            Object.assign(state, initialState)
        }
    },
});

export const { showAlertBox, hideAlertBox } = alertSlice.actions;

export const selectAlert = (state) => {
    return state.alert;
};

export default alertSlice.reducer;
