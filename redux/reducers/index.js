import { combineReducers } from "redux";
import APPSTATE from "./appStateReducer";
import USER from "./userReducer";

const COMBINED_REDUCERS = combineReducers({
  APPSTATE,
  USER,
});
export default COMBINED_REDUCERS;
