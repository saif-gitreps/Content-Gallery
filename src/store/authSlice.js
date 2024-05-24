import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   status: false,
   userData: null,
};

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      login: (state, action) => {
         state.status = true;
         state.userData = action.payload.userData;
      },
      logout: (state) => {
         state.status = false;
         state.userData = null;
      },
      update: (state, action) => {
         state.userData = action.payload.updatedUserData;
      },
   },
});

export const { login, logout, update } = authSlice.actions;

export default authSlice.reducer;
