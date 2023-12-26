
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { email: null, token: null },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.value.email = action.payload.email;
            state.value.token = action.payload.token;
        },
        logoutUser: (state) => {
            state.value.email = null;
            state.value.token = null;
        },
        updateEmail: (state, action) => {
            state.value.email = action.payload;
        }
    },
});

export const { loginUser, logoutUser, updateEmail } = userSlice.actions;
export default userSlice.reducer;