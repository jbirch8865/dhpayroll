import { planningAuthProvider } from "./msauth";
import axios from "axios";
import { toast } from "react-toastify";
import logging from "./logging";

export async function getBackendAzureADUserAccessToken() {
  try {
    const token = await planningAuthProvider.getAccessToken();
    process.env.NODE_ENV === "development" && logging("Logging this token because this is development"+JSON.stringify(token));
    return token.accessToken;
  } catch (e) {
    logging(e, "error");
  }
  toast.error("There was an issue with SSO.  Please inform the tech team.");
  throw new Error();
}

function SimulateLongerAPILoadTimes(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestHandler(config) {
  const token = await getBackendAzureADUserAccessToken();
  config.headers.Authorization = token;
  return config;
}

let session_exp = false;

async function responseHandler(response) {
  clearTimeout(session_exp);
  session_exp = setTimeout(() => {
    response.status === 201 &&
      response.data.message !== "" &&
      toast.success(response.data.message) &&
      logging(JSON.parse(response.headers.response));
  }, 300);
  await SimulateLongerAPILoadTimes(
    process.env.NODE_ENV === "development" ? 0 : 0
  );
  return response;
}

async function errorResponseHandler(error) {
  if (typeof error.response === "undefined") {
    logging("API is unreachable see next error for more details", "error")
    logging(error, "error");
    throw new Error(error);
  }
  clearTimeout(session_exp);
  session_exp = setTimeout(() => {
    error.response.status >= 400 &&
      error.response.status < 500 &&
      typeof error.response.headers.response !== "undefined" &&
      toast.error(JSON.parse(error.response.headers.response).message, {
        autoClose: false,
      }) &&
      logging(JSON.parse(error.response.headers.response));
    error.response.status >= 500 &&
      typeof error.response.headers.response !== "undefined" &&
      toast.error(JSON.parse(error.response.headers.response).message, {
        autoClose: false,
      }) &&
      logging(JSON.parse(error.response.headers.response));
    error.response.status >= 400 &&
      typeof error.response.headers.response === "undefined"&&
      logging("unknown axios error" + error);
  }, 300);
  return error.response
}

export const CDMapi = axios.create({
  baseURL: process.env.REACT_APP_CDM_URI + "/api",
  timeout: 5000,
});
export const Planningapi = axios.create({
  baseURL: process.env.REACT_APP_PLANNING_URI + "/api",
  timeout: 5000,
});
export const Dispatchapi = axios.create({
  baseURL: process.env.REACT_APP_DISPATCH_URI + "/api",
  timeout: 5000,
});

export const Payrollapi = axios.create({
  baseURL: process.env.REACT_APP_PAYROLL_URI + "/api",
  timeout: 15000,
});

CDMapi.interceptors.request.use(requestHandler);
CDMapi.interceptors.response.use(responseHandler, errorResponseHandler);

Planningapi.interceptors.request.use(requestHandler);
Planningapi.interceptors.response.use(responseHandler, errorResponseHandler);
Dispatchapi.interceptors.request.use(requestHandler);
Dispatchapi.interceptors.response.use(responseHandler, errorResponseHandler);
Payrollapi.interceptors.request.use(requestHandler);
Payrollapi.interceptors.response.use(responseHandler, errorResponseHandler);
