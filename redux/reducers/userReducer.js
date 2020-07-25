import { ActionType } from "../actions";
import { SET_USER_CLASS } from "../actions/users";

const InitialAppState = {
  user: {},
  selected_class: null,
};
export default (state = InitialAppState, { type, payload }) => {
  switch (type) {
    case ActionType.LOGED_IN: {
      return {
        ...state,
        user: payload,
      };
    }
    case ActionType.LOG_OUT: {
      alert(1)
      return InitialAppState;
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
