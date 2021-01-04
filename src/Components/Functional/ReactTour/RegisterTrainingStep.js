import {Payrollapi} from "../../../Utils/api"
import logging from "../../../Utils/logging"
import GetUserCompletedTrainings from "./GetUserCompletedTrainingSteps"
import {store} from "../../../index"

function getStore()
{
  const state = store.getState()
  return state
}
export default function RegisterTrainingStep(name,importance)
{
  Array.isArray(getStore().trainingSteps.registered) ? (getStore().trainingSteps.registered.filter(step => step.name === name).length === 0 && Payrollapi.post('/reacttour/trainingsteps', {
      name,
      importance
    })
    .then(function (response) {
      GetUserCompletedTrainings()
    })
    .catch(function (error) {
      logging(error,"error");
    })) : setTimeout(() => RegisterTrainingStep(name),300)
    return <></> 
}