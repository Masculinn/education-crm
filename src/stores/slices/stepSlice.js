import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  no: 0,
  auth: null,
};

const stepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {
    setStep(state, action) {
      return action.payload;
    },
  },
});

export const { setStep } = stepSlice.actions;

export default stepSlice.reducer;
