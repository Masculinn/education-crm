import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading(state, action) {
      return action.payload;
    },
    resetLoading(state) {
      return initialState;
    },
  },
});

export const { setLoading, resetLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
