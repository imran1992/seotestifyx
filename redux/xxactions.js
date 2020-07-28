import {nextLogout, nextLogin} from '@utils/nextAuth';
//= ===============Action Types Constants
const APP_BUSY = 'APP_BUSY';
const LOG_OUT = 'LOG_OUT';
const LOGED_IN = 'LOGED_IN';
const GET_COURCES = 'GET_COURCES';

// logout
const logOut = () => async (dispatch) => {
  nextLogout();
  dispatch({type: LOG_OUT});
};
const ActionType = {
  APP_BUSY,
  LOG_OUT,
  LOGED_IN,
  GET_COURCES,
};
export {ActionType, logOut};
