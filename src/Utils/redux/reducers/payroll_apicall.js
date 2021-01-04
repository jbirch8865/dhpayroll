import * as Actions from "../actions/actionConstants";
import initialState from "../initialState";

export default function payrollApiReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.GET_USER_PREFERENCES_LOADING:
        return { ...state, loading:true};
    case Actions.GET_USER_PREFERENCES:
        return { ...state, loading:false, userPreferences: action.userpreferences };
    default:
      return state;
  }
}
