import React, { useEffect } from "react"
import * as actions from "../../../Utils/redux/actions/reactTour"
import RegisterTrainingStep from "./RegisterTrainingStep"
import { connect } from "react-redux"
import logging from "../../../Utils/logging"
function StepContent(props) {
  return (
    <>
      <div>{props.title}</div>
    </>
  )
}

function TrainingStep(props) 
{
  useEffect(() => {
    RegisterTrainingStep(props.trainingName)
    logging(props.userCompleted)
    const stepInteraction = typeof props.stepInteraction !== "undefined" ? props.stepInteraction : false
    if(props.userCompleted.length !== 1 || props.userCompleted[0] !== false)
    {
      !props.userCompleted.includes(props.trainingName) && 
      setTimeout(() => {
        const step = {
          selector:"." + props.trainingName,
          content: () => (
            <StepContent
              title={props.title}
            />
          ),
          stepInteraction: stepInteraction,
        }
        props.addTrainingStep(step)
      },props.steps.length * 100)  
    }
    return () => {
      const step = {
        selector:"." + props.trainingName,
        content: () => (
          <StepContent
            title={props.title}
          />
        ),
        stepInteraction: stepInteraction,
      }
      props.removeTrainingStep(step)
    }
  },[props.userCompleted])
  return <></>
}



const mapDispatchToProps = dispatch => {
  return {
    addTrainingStep: (step,delay) => delay ? setTimeout(() => dispatch(actions.addTrainingStep(step)),200) : dispatch(actions.addTrainingStep(step)),
    removeTrainingStep: (step,delay) => delay ? setTimeout(() => dispatch(actions.removeTrainingStep(step)),200) : dispatch(actions.removeTrainingStep(step)),
    hideTrainingTour: () => dispatch(actions.hideTrainingTour()),
  }
}
const mapStateToProps = (state) => {
  return {
    steps: state.trainingSteps.steps,
    userCompleted: state.trainingSteps.userCompleted
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TrainingStep);
      