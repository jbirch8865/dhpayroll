import { createStore, applyMiddleware, compose } from "redux"
import rootReducer from "./reducers/"
import initialState from "./initialState"
import thunk from "redux-thunk"
import LogRocket from 'logrocket'
export default function configureStore() {
  if (typeof window !== "undefined") {
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    return createStore(
      rootReducer,
      initialState,
      composeEnhancers(applyMiddleware(thunk,LogRocket.reduxMiddleware()))
    )
  } else {
    return createStore(
      rootReducer,
      initialState,
      applyMiddleware(thunk,LogRocket.reduxMiddleware())
    )
  }
}
