import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./authSlice";
import themeReducers from "./themeSlice";

const store = configureStore({
   reducer: {
      auth: authReducers,
      theme: themeReducers,
   },
});

export default store;
