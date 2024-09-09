import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  action: "view",
};

const studentDocumentManagerSlice = createSlice({
  name: "documentManager",
  initialState,
  reducers: {
    setDocumentSetting(state, action) {
      return action.payload;
    },
  },
});

export const { setDocumentSetting } = studentDocumentManagerSlice.actions;
export default studentDocumentManagerSlice.reducer;
