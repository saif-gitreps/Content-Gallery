import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./authSlice";

const store = configureStore({
   reducer: {
      auth: authReducers,
      // posts: postSlice
   },
});

export default store;
