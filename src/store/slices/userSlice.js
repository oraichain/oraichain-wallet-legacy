import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: {
        setUser: (state, action) => {
            return action.payload;
        },
        removeUser: (state, action) => {
            return null;
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;

export const selectUser = (state) => {
    return state.user;
};

export default userSlice.reducer;
