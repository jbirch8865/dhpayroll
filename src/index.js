import React from "react";
import ReactDOM from "react-dom";
import Home from "./Pages/index";
import logging from "./Utils/logging";
import TourWrapper from "./Components/Presentation/ReactTour/TourWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { AzureAD, AuthenticationState } from "react-aad-msal";
import { planningAuthProvider } from "./Utils/msauth";
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import configureStore from "./Utils/redux/configureStore";
import BuildLogRocket from "./Utils/LogRocket";
import InitialLoad from './InitialLoad';
export const store = configureStore();

ReactDOM.render(
  <AzureAD provider={planningAuthProvider} forceLogin={true}>
    {({ accountInfo,authenticationState }) => {
      if(AuthenticationState.Authenticated === authenticationState)
      {
        BuildLogRocket(accountInfo);
        return (
          <Provider store={store}>
            <InitialLoad />
            <ToastContainer />
            <TourWrapper />
            <Home />
          </Provider>
        );  
      }else
      {
        return (<></>)
      }
    }}
  </AzureAD>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(logging);
