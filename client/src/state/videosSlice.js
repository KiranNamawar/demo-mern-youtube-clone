import { createSlice } from "@reduxjs/toolkit";

const videosSlice = createSlice({
  name: "videos",
  initialState: [],
  reducers: {
    setVideos: (_, action) => {
      return action.payload;
    },
  },
});

export const videosReducer = videosSlice.reducer;
export const { setVideos } = videosSlice.actions;
