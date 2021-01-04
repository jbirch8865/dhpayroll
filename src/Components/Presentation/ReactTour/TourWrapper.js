import React, { useState, useEffect } from "react";
import Tour from "reactour";
import { connect } from "react-redux";
import * as actions from "../../../Utils/redux/actions/reactTour";
import GetUserCompletedTrainings from '../../Functional/ReactTour/GetUserCompletedTrainingSteps';
const TourWrapper = (props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [goToStep, setGoToStep] = useState(0);
  useEffect(() => props.getRegisteredTrainings(),[])
  const hideTrainingTour = () => {
    props.hideTrainingTour()
    setCurrentStep(0)
    setTimeout(() => props.completedTraining(props.steps[currentStep].selector.replace(".", "")),100)
    setTimeout(() => props.getUserCompletedTrainings(),300)
  }

  return (
    <>
      <GetUserCompletedTrainings />
      {props.steps.length !== 0 && (
        <Tour
          steps={props.steps}
          isOpen={props.showTour}
          showNumber={true}
          onRequestClose={() => {
            hideTrainingTour()
          }
         }
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
            setGoToStep(currentStep - 1);
          }}
          prevButton={<></>}
          showCloseButton={false}
          lastStepNextButton={"Click here and do great things!"}
          onBeforeClose={() => {
            
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
    getRegisteredTrainings: () => dispatch(actions.getRegisteredTrainings()),
    getUserCompletedTrainings: () => dispatch(actions.GetUserCompletedTrainings())
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
