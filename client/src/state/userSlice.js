import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    email: null,
    avatar: null,
    username: null,
    channels: [],
    accessToken: null,
  },
  reducers: {
    loginSuccess(state, action) {
      const { id, email, avatar, username, channels, accessToken } =
        action.payload;
      state.id = id;
      state.email = email;
      state.avatar = avatar ?? null;
      state.username = username;
      state.channels = channels;
      state.accessToken = accessToken;
    },
    logoutSuccess(state) {
      state.id = null;
      state.email = null;
      state.avatar = null;
      state.username = null;
      state.channels = [];
      state.accessToken = null;
    },
  },
});

export const userReducer = userSlice.reducer;
export const { loginSuccess, logoutSuccess } = userSlice.actions;
