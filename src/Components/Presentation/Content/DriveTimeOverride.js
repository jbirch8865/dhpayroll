import React, { useState } from "react";
import { Popover, Input, InputNumber, Button, message, Tooltip } from "antd";
import { InfoCircleOutlined, SyncOutlined } from "@ant-design/icons";
import * as Actions from "../../../Utils/redux/actions/payroll_apicall";
import TrainingStep from "../../Functional/ReactTour/TrainingStep";

export default function DriveTimeOverride(props) {
  const mins =
    props.drivetime.actual_time !== null
      ? props.drivetime.actual_time
      : props.drivetime.home_distance > 60 && props.drivetime.office_distance > 60
      ? props.drivetime.paid_time_allowable
      : 0;
  const miles =
    props.drivetime.actual_distance !== null
      ? props.drivetime.actual_distance
      : props.drivetime.paid_distance_allowable <
        props.drivetime.home_drive_distance
      ? props.drivetime.paid_distance_allowable
      : props.drivetime.home_drive_distance;
  const [overRide, setOverRide] = useState({
    mins,
    miles,
    justification: props.drivetime.justification,
  });
  const [overRiding, setOverRiding] = useState(false);
  return (
    <Popover
      trigger="click"
      content={
        <>
          Why are we overriding google?
          <Input.TextArea
            value={overRide.justification}
            onChange={(value) =>
              setOverRide({ ...overRide, justification: value.target.value })
            }
          />
          Number Of Minutes:
          <InputNumber
            size="small"
            min={0}
            max={1000}
            value={overRide.mins}
            onChange={(value) => setOverRide({ ...overRide, mins: value })}
          />
          <br />
          Number Of Miles:
          <InputNumber
            size="small"
            min={0}
            max={1000}
            value={overRide.miles}
            onChange={(value) => setOverRide({ ...overRide, miles: value })}
          />
          <br />
          <div style={{ height: "40px" }}>
            <div style={{ float: "right" }}>
              <Button
                onClick={() => {
                  if (overRide.justification === "") {
                    message.error(
                      "You must justify overriding the approved drive time"
                    );
                  } else {
                    setOverRiding(true);
                    Actions.overRideDriveTime(
                      props.drivetime.id,
                      overRide.mins < 0 ? 0 : overRide.mins,
                      overRide.miles < 0 ? 0 : overRide.miles,
                      overRide.justification
                    ).then((response) => {
                      props.getDriveTime(
                        props.drivetime.id,
                        [props.drivetime.need_id],
                        false
                      );
                      setOverRiding(false);
                    });
                  }
                }}
                loading={overRiding}
                type="danger"
              >
                Override
              </Button>
            </div>
          </div>
        </>
      }
      title="Override"
    >
      <div style={{ cursor: "pointer" }}>
        <Tooltip
          title={
            <>
              Round trip from office
              <br />
              {props.drivetime.paid_time_allowable +
                60 +
                " mins/" +
                (props.drivetime.paid_distance_allowable + 60) +
                " mi."}
              <br />
              Round trip from home
              <br />
              {props.drivetime.home_drive_time +
                60 +
                " mins/" +
                (props.drivetime.home_drive_distance + 60) +
                " mi."}
              <br />
              {'Closest Office ' + props.drivetime.office}
              <br />
              {props.drivetime.justification}
            </>
          }
        >
          <TrainingStep
            trainingImportance={1}
            title="Click here to over ride the drive time or distance."
            trainingName="content_drivetimeoverride_authorized"
          />
          <span className="content_drivetimeoverride_authorized">
            {mins +
              " mins"}
          </span>
        </Tooltip>
        {props.drivetime.actual_time !== null ||
        props.drivetime.actual_distance !== null ? (
          <Tooltip
            title={
              <>
                Distance From Office
                <br />
                {(props.drivetime.paid_time_allowable < 0
                  ? 0
                  : props.drivetime.paid_time_allowable) +
                  " mins/" +
                  (props.drivetime.paid_distance_allowable < 0
                    ? 0
                    : props.drivetime.paid_distance_allowable) +
                  " mi."}
                <br />
                Distance From Home
                <br />
                {(props.drivetime.home_drive_time < 0
                  ? 0
                  : props.drivetime.home_drive_time) +
                  " mins/" +
                  (props.drivetime.home_drive_distance < 0
                    ? 0
                    : props.drivetime.home_drive_distance) +
                  " mi."}
                <br />
                {'Closest Office ' + props.drivetime.office}
                <br />
                {props.drivetime.justification}
              </>
            }
          >
            <TrainingStep
              trainingImportance={1}
              title="This has been previously overridden.  Click here to clear the overide."
              trainingName="content_drivetimeoverride_overridden"
            />
            <InfoCircleOutlined
              className="content_drivetimeoverride_overridden"
              onClick={() =>
                props.getDriveTime(
                  props.drivetime.id,
                  [props.drivetime.need_id],
                  true
                )
              }
            />
          </Tooltip>
        ) : (
          <>
            <TrainingStep
              trainingImportance={1}
              title="We use current live google maps information to calculate our drive distance and drive times, we do include what google expects traffic to be at the time of the start of the shift.  Click here to get new google data for this shift."
              trainingName="content_drivetimeoverride_refresh"
            />
            <SyncOutlined
              className="content_drivetimeoverride_refresh"
              onClick={() =>
                props.getDriveTime(
                  props.drivetime.id,
                  [props.drivetime.need_id],
                  true
                )
              }
            />
          </>
        )}
      </div>
    </Popover>
  );
}
