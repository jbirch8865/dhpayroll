import * as Actions from "../actions/actionConstants"
import initialState from "../initialState"
export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.SOMETHING_IS_LOADING:
      return { ...state, loading: true }
    case Actions.DONE_LOADING:
      return { ...state, loading: false }
    default:
      return state
  }
}
