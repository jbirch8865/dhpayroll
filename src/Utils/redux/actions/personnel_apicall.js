import { Dispatchapi } from "../../api";

export function getShiftDetails(start_date, end_date) {
  return Dispatchapi.get("/shifts", {
    params: {
      start_date,
      end_date,
      scope:'payroll'
    },
  });
}

export function getShiftDetailsByPerson(person_id, start_date, end_date) {
  return Dispatchapi.get("/shifts/", {
    params: {
      person_id,
      start_date,
      end_date,
    },
  });
}
