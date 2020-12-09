import * as Actions from "../actions/actionConstants";
import initialState from "../initialState";

export default function trainingStepsReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.ADD_TRAINING_STEP:
      if(state.steps.filter(step => step.selector === action.step.selector).length > 0)
      {
        return state;
      }else
      {
        return { ...state, steps: [...state.steps, action.step] };
      }
    case Actions.REMOVE_TRAINING_STEP:
      return { ...state, steps: state.steps.filter(step => step.selector !== action.step.selector) };
    case Actions.REMOVE_ALL_TRAINING_STEPS:
      return { ...state, steps: [] };
    case Actions.SHOW_TRAINING_TOUR:
      return { ...state, showTour: true };
    case Actions.HIDE_TRAINING_TOUR:
      return { ...state, showTour: false };
    case Actions.GOTO_TRAINING_STEP:
      return { ...state, currentStep: action.currentStep };
    case Actions.GET_USER_COMPLETED_TRAININGS:
      return { ...state, userCompleted: action.completedtrainings.map(training => training.trainingstep.name)}
    default:
      return state;
  }
}
