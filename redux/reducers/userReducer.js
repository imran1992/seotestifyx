import { ActionType } from "../actions";
import { SET_USER_CLASS } from "../actions/users";

export const InitialUserState = {
  user: {},
  selected_class: null,
};
const USER_STATE = (state = InitialUserState, { type, payload }) => {
  switch (type) {
    case ActionType.LOGED_IN: {
      return {
        ...state,
        user: payload,
      };
    }
    case ActionType.LOG_OUT: {
      alert(1);
      return InitialUserState;
    }
    case SET_USER_CLASS: {
      return {
        ...state,
        selected_class: payload,
      };
    }
    default:
      return state;
  }
};

export default USER_STATE;
