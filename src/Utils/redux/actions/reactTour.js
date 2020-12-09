import * as Actions from "./actionConstants";
import { Payrollapi } from "../../api";
export function addTrainingStep(step) {
  return {
    type: Actions.ADD_TRAINING_STEP,
    step,
  };
}

export function removeTrainingStep(step) {
  return {
    type: Actions.REMOVE_TRAINING_STEP,
    step,
  };
}
export function removeAllTrainingSteps() {
  return {
    type: Actions.REMOVE_ALL_TRAINING_STEPS,
  };
}

export function gotoTrainingStep(step) {
  return {
    type: Actions.GOTO_TRAINING_STEP,
    currentStep: step,
  };
}

export function showTrainingTour() {
  return {
    type: Actions.SHOW_TRAINING_TOUR,
  };
}

export function hideTrainingTour() {
  return {
    type: Actions.HIDE_TRAINING_TOUR,
  };
}

function setUserCompletedTrainings(completedtrainings) {
  return {
    type: Actions.GET_USER_COMPLETED_TRAININGS,
    completedtrainings,
  };
}

export function GetUserCompletedTrainings() {
  return (dispatch) => {
    Payrollapi.get("/reacttour/usercompletedtrainingsteps")
      .then(function (response) {
        dispatch(setUserCompletedTrainings(response.data.usercompletedtrainingsteps))
        return true
      })
      .catch(function (error) {
        dispatch(removeAllTrainingSteps())
        return false
      });
  };
}

export function CompleteUserTraining(name) {
  return dispatch => {
    Payrollapi.post("/reacttour/usercompletedtrainingsteps",{name}).then(function (response) {
    }).catch(function (error) {});
  }
}
