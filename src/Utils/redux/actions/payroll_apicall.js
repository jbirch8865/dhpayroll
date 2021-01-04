import { Payrollapi } from "../../api";
import * as Actions from "./actionConstants"

function setUserPreferences(userpreferences) {
  return {
    type: Actions.GET_USER_PREFERENCES,
    userpreferences,
  };
}

function setUserPreferencesLoading()
{
  return {
    type: Actions.GET_USER_PREFERENCES_LOADING
  };
}

export function getTimeCards(needs) {
  return Payrollapi.get("/timecards", {
    params: {
      needs
    },
  });
}


export function getDriveTime(needs,override_google) {
  let params = {}
  if(override_google === false)
  {
    params = {params:{needs}}
  }else
  {
    params = {params:{needs,override_google: + override_google}}
  }
  return Payrollapi.get("/drivetimes", params);
}

export function getUserPreferences() {
  return (dispatch) => {
    dispatch(setUserPreferencesLoading())
    Payrollapi.get("/userpreferences")
      .then(function (response) {
        dispatch(setUserPreferences(response.data.userpreferences))
        return true
      })
  };
}


export function addTimeCard(need_id,people_id,description) {
  return Payrollapi.post("/timecards", {
      need_id,
      people_id,
      description
  });
}

export function deleteTimeCard(timecard) {
  return Payrollapi.delete("/timecards/"+timecard);
}


export function overRideDriveTime(drivetime,actual_time,actual_distance,justification) {
  return Payrollapi.put("/drivetime/"+drivetime, {
      actual_time,
      actual_distance,
      justification
  });
}

