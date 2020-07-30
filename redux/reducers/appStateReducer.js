import { ActionType } from "../actions";
export const InitialAppState = {
  busy: false,
  allCources: [],
  tests: [],
};
const APP_STATE = (state = InitialAppState, { type, payload }) => {
  switch (type) {
    case ActionType.APP_BUSY: {
      return {
        busy: payload,
      };
    }

    case ActionType.GET_COURCES: {
      return { allCources: payload };
    }

    case "GET_TESTS": {
      return {
        ...state,
        tests: payload,
      };
    }
    default:
      return state;
  }
};

export default APP_STATE;
