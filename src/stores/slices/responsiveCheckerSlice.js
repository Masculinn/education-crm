import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: false,
};

const responsiveCheckerSlice = createSlice({
  name: "responsiveChecker",
  initialState,
  reducers: {
    setResponsiveChecker(state, action) {
      state.state = action.payload.state;
    },
  },
});

export const { setResponsiveChecker } = responsiveCheckerSlice.actions;
export default responsiveCheckerSlice.reducer;
