import { combineReducers } from "redux"
import trainingStepsReducer from "./reactTour"
import loadingReducer from "./loading"
const rootReducer = combineReducers({
  trainingSteps: trainingStepsReducer,
  somethingIsLoading: loadingReducer
})

export default rootReducer
