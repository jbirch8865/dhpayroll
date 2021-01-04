import { combineReducers } from "redux"
import trainingStepsReducer from "./reactTour"
import loadingReducer from "./loading"
import userPreferencesReducer from "./payroll_apicall"
const rootReducer = combineReducers({
  trainingSteps: trainingStepsReducer,
  somethingIsLoading: loadingReducer,
  userPreferences: userPreferencesReducer
})

export default rootReducer
