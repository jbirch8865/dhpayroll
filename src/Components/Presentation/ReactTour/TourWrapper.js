import React, { useState } from "react";
import Tour from "reactour";
import { connect } from "react-redux";
import * as actions from "../../../Utils/redux/actions/reactTour";
import GetUserCompletedTraining from "../../Functional/ReactTour/GetUserCompletedTrainingSteps";
const TourWrapper = (props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [goToStep, setGoToStep] = useState(0);
  return (
    <>
      <GetUserCompletedTraining />
      {props.steps.length !== 0 && (
        <Tour
          steps={props.steps}
          isOpen={props.showTour}
          showNumber={true}
          onRequestClose={() => props.hideTrainingTour()}
          closeWithMask={false}
          getCurrentStep={(curr) => setCurrentStep(curr)}
          showButtons={true}
          nextStep={() => {
            setGoToStep(currentStep + 1);
            props.completedTraining(
              props.steps[currentStep].selector.replace(".", "")
            );
          }}
          previousStep={() => {
            setGoToStep(currentStep);
          }}
          lastStepNextButton={"I'm so over this"}
          onBeforeClose={() => {
             props.completedTraining(
               props.steps[currentStep].selector.replace(".", "")
            );
          }}
          disableDotsNavigation={true}
          disableKeyboardNavigation={true}
          goToStep={goToStep}
        />
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideTrainingTour: () => dispatch(actions.hideTrainingTour()),
    completedTraining: (training) =>
      dispatch(actions.CompleteUserTraining(training)),
  };
};

const mapStateToProps = (state) => {
  return {
    steps: state.trainingSteps.steps,
    showTour: state.trainingSteps.showTour,
    currentStep: state.trainingSteps.currentStep,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TourWrapper);
