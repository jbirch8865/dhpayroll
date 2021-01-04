import React, { useEffect, useState } from "react"
import * as actions from "../../../Utils/redux/actions/reactTour"
import RegisterTrainingStep from "./RegisterTrainingStep"
import { connect } from "react-redux"
function StepContent(props) {
  return (
    <>
      <div>{props.title}</div>
    </>
  )
}

function TrainingStep(props) 
{
  const [fireUseEffect, setFireUseEffect] = useState(false)
  useEffect(() => {
    RegisterTrainingStep(props.trainingName,props.trainingImportance)
    const stepInteraction = typeof props.stepInteraction !== "undefined" ? props.stepInteraction : false
    if(props.userPreferences.loading)
    {
        setTimeout(() => setFireUseEffect(!fireUseEffect),500)
    }else
    {
      const includeTips = props.userPreferences.userPreferences.filter(preference => preference.preference === "tips").length === 0
      if((props.userCompleted.length !== 1 || props.userCompleted[0] !== false) && (includeTips || props.trainingImportance > 0))
      {
        props.userCompleted.filter(step => step.trainingstep.name === props.trainingName).length === 0 && 
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
  },[props.userCompleted,fireUseEffect])
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
    userCompleted: state.trainingSteps.userCompleted,
    userPreferences: state.userPreferences
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(TrainingStep);
      