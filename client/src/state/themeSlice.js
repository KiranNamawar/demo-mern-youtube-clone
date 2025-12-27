import { createSlice } from "@reduxjs/toolkit";

export const THEME = {
  DARK: "dark",
  LIGHT: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState: THEME.LIGHT,
  reducers: {
    setTheme(_, action) {
      return action.payload;
    },
    toggleTheme(state) {
      return state === THEME.DARK ? THEME.LIGHT : THEME.DARK;
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
