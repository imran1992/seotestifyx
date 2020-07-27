import { combineReducers } from "redux";
import APPSTATE from "./appStateReducer";
import USER from "./userReducer";
export default combineReducers({
  APPSTATE,
  USER,
});
