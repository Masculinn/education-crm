import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setModal(state, action) {
      state.state = action.payload.state;
    },
  },
});

export const { setModal } = modalSlice.actions;
export default modalSlice.reducer;
