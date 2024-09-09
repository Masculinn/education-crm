import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isEditMode: false,
  id: "",
};

const studentViewSlice = createSlice({
  name: "studentView",
  initialState,
  reducers: {
    setStudentViewData(state, action) {
      return action.payload;
    },
    setStudentEditData(state, action) {
      return action.payload;
    },
  },
});

export const { setStudentViewData, setStudentEditData } =
  studentViewSlice.actions;

export default studentViewSlice.reducer;
