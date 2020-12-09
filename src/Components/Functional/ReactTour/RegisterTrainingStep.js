import {Payrollapi} from "../../../Utils/api"
import logging from "../../../Utils/logging"
import GetUserCompletedTrainings from "./GetUserCompletedTrainingSteps"
export default function RegisterTrainingStep(name)
{
  Payrollapi.post('/reacttour/trainingsteps', {
      name
    })
    .then(function (response) {
      GetUserCompletedTrainings()
    })
    .catch(function (error) {
      logging(error,"error");
    });
}