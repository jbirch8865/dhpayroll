import { Dispatchapi } from "../../api";

export function getShiftDetails(start_date, end_date) {
  return Dispatchapi.get("/shifts", {
    start_date,
    end_date,
  });
}