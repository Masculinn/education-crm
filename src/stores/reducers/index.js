import { combineReducers } from "@reduxjs/toolkit";
import stepSlice from "../slices/stepSlice";
import loginSlice from "../slices/loginSlice";
import authSlice from "../slices/authSlice";
import loadingSlice from "../slices/loadingSlice";
import componentSlice from "../slices/componentSlice";
import studentDocumentManager from "../slices/studentDocumentManager";
import modalSlice from "../slices/modalSlice";
import studentViewSlice from "../slices/studentViewSlice";
import editSlice from "../slices/editSlice";
import responsiveCheckerSlice from "../slices/responsiveCheckerSlice";

const rootReducer = combineReducers({
  step: stepSlice,
  login: loginSlice,
  auth: authSlice,
  loading: loadingSlice,
  comp: componentSlice,
  studentProfileActions: studentDocumentManager,
  modal: modalSlice,
  studentView: studentViewSlice,
  edit: editSlice,
  responsive: responsiveCheckerSlice,
});

export default rootReducer;
