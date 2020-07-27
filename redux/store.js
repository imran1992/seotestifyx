import { useMemo } from "react";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
//import { persistStore } from "redux-persist";
// export default () => {
//   let store;
//   const isClient = typeof window !== "undefined";
//   if (isClient) {
//     const { persistReducer } = require("redux-persist");
//     const storage = require("redux-persist/lib/storage").default;
//     const { composeWithDevTools } = require("redux-devtools-extension");
//     const persistConfig = {
//       key: "root",
//       storage,
//       blacklist: [],
//     };
//     store = createStore(
//       persistReducer(persistConfig, reducer),
//       {},
//       composeWithDevTools(applyMiddleware(thunk))
//     );
//     store.__PERSISTOR = persistStore(store);
//   } else {
//     store = createStore(reducer, {}, applyMiddleware(thunk));
//   }
//   return store;
// };
let store;
// const persistConfig = {
//   key: "root",
//   storage,
//   blacklist: [],
// };
function initStore() {
  return createStore(reducer, {}, composeWithDevTools(applyMiddleware(thunk)));
}
export const initializeStore = ({}) => {
  let _store = store ?? initStore({});

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (store) {
    _store = initStore({
      ...store.getState(),
      //...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};
export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
