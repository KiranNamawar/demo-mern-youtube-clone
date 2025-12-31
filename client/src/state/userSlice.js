import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  email: null,
  avatar: null,
  username: null,
  channels: [],
  accessToken: null,
  subscriptions: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => ({ ...state, ...action.payload }),
    logoutSuccess: () => initialState,
  },
});

export const userReducer = userSlice.reducer;
export const { loginSuccess, logoutSuccess } = userSlice.actions;
