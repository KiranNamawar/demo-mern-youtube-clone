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
    addSubscription: (state, action) => {
      state.subscriptions.push(action.payload);
    },
    removeSubscription: (state, action) => {
      state.subscriptions = state.subscriptions.filter(
        (sub) => sub._id !== action.payload
      );
    },
    addChannel: (state, action) => {
      const exists = state.channels.some(
        (chan) => chan._id === action.payload._id
      );
      if (!exists) state.channels.unshift(action.payload);
    },
    updateChannel: (state, action) => {
      state.channels = state.channels.map((chan) =>
        chan._id === action.payload._id ? action.payload : chan
      );
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(
        (chan) => chan._id !== action.payload
      );
    },
  },
});

export const userReducer = userSlice.reducer;
export const {
  loginSuccess,
  logoutSuccess,
  addSubscription,
  removeSubscription,
  addChannel,
  updateChannel,
  removeChannel,
} = userSlice.actions;
