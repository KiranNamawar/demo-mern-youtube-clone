import { configureStore } from "@reduxjs/toolkit";
import { themeReducer } from "./themeSlice";
import { userReducer } from "./userSlice";
import { authPersistenceMiddleware } from "./auth";

const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authPersistenceMiddleware),
});

export default store;
