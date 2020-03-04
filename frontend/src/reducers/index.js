import { combineReducers } from "redux";
import analyticsReducer from "./analyticsReducer";
import { reducer as formReducer } from "redux-form";

export default combineReducers({
  form: formReducer,
  analytics: analyticsReducer
});
