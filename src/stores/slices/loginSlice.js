import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,
  auth: "",
  id: "",
  email: "",
  name: "",
  city: "",
  university: "",
  program: "",
  age: "",
  status: "",
  phone: "",
  address: "",
  avatar: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginData(state, action) {
      return action.payload;
    },
    resetLoginData(state) {
      return initialState;
    },
  },
});

export const { setLoginData, resetLoginData } = loginSlice.actions;

export default loginSlice.reducer;
