import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  name: "",
  surname: "",
  city: "",
  university: "",
  university_program: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action) {
      return action.payload;
    },
    resetUserData(state) {
      return initialState;
    },
  },
});

export const { setUserData, resetUserData } = authSlice.actions;

export default authSlice.reducer;
