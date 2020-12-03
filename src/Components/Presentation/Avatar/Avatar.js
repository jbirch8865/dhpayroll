import React, { useEffect, useState } from "react";
import { Avatar, Popover, Button, Switch } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
//import ShowTips from "./ShowTips";
import { AzureAD } from "react-aad-msal";
import { planningAuthProvider } from "../../../Utils/msauth";
import {connect} from "react-redux"
import TrainingStep from "../../Functional/ReactTour/TrainingStep"

function UserAvatar(props) {
  const [cursor, setCursor] = useState("default ");
  const [popoverVisible, setPopoverVisible] = useState(false);
  useEffect(() => {
  }, []);

  return (
    <AzureAD provider={planningAuthProvider}>
      {({ logout, accountInfo }) => {
        return (
          <Popover
            content={
              <>
                Dark Mode: <Switch checked={props.darkMode} onChange={() => props.setDarkMode(props.darkMode === "dark"?"light":"dark")}/>
                <br></br>
                <Button onClick={logout} block danger>Logout</Button>
              </>
            }
            title={<>{accountInfo.account.name}</>}
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={() => {setPopoverVisible(!popoverVisible)}}
            placement="bottom"
          >
            {/* <TrainingStep title="Click your avatar to see your profile options" trainingName="avatar_avatar_react_tour_step"/> */}
            <Avatar
              className={
                "avatar_avatar_react_tour_step " +  
                (props.loading && "api_loading_stuff")
              }
              size="large"
              icon={<UserOutlined />}
              onMouseEnter={() => setCursor("pointer")}
              onMouseLeave={() => setCursor("default")}
              style={{ cursor: cursor}}
            />
          </Popover>
        );
      }}
    </AzureAD>
  );
}

const mapDispatchToProps = dispatch => {
  return {
//    addTrainingStep: (group,delay) => delay ? setTimeout(() => dispatch(actions.addTrainingStep(group)),200) : dispatch(actions.addTrainingStep(group)),
  }
}
const mapStateToProps = (state) => {
  return {
    loading: state.somethingIsLoading.loading
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(UserAvatar);
      