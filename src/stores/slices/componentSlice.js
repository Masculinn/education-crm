import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  no: "",
};

const componentSlice = createSlice({
  name: "comp",
  initialState,
  reducers: {
    setComponentNumber(state, action) {
      return action.payload;
    },
  },
});

export const { setComponentNumber } = componentSlice.actions;

export default componentSlice.reducer;
