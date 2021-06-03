import { createSlice } from "@reduxjs/toolkit";

export const requestSlice = createSlice({
    name: "request",
    initialState: {
        id: null
    },
    reducers: {
        updateRequestId: (state, action) => {
            state.id = action.payload;
        },
    },
});

export const { updateRequestId } = requestSlice.actions;

export const selectRequest = (state) => {
    return state.request;
};

export default requestSlice.reducer;
