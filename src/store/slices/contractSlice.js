import { createSlice } from "@reduxjs/toolkit";

export const contractSlice = createSlice({
    name: "contract",
    initialState: {
        address: null
    },
    reducers: {
        updateContractAddress: (state, action) => {
            state.address = action.payload;
        },
    },
});

export const { updateContractAddress } = contractSlice.actions;

export const selectContract = (state) => {
    return state.contract;
};

export default contractSlice.reducer;
