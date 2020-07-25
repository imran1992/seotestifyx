import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import { persistStore } from "redux-persist";
export default () => {
  let store;
  const isClient = typeof window !== "undefined";
  if (isClient) {
    const { persistReducer } = require("redux-persist");
    const storage = require("redux-persist/lib/storage").default;
    const { composeWithDevTools } = require("redux-devtools-extension");
    const persistConfig = {
      key: "root",
      storage,
      blacklist: []
    };
    store = createStore(
      persistReducer(persistConfig, reducer),
      {},
      composeWithDevTools(applyMiddleware(thunk))
    );
    store.__PERSISTOR = persistStore(store);
  } else {
    store = createStore(reducer, {}, applyMiddleware(thunk));
  }
  return store;
};
