import { Payrollapi } from "../../api";

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

