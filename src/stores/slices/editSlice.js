import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const editSlice = createSlice({
  name: "edit",
  initialState: {},
  reducers: {
    setEditData(state, action) {
      return { ...state, ...action.payload };
    },
    resetEditData() {
      return initialState;
    },
  },
});

export const { setEditData, resetEditData } = editSlice.actions;

export default editSlice.reducer;
