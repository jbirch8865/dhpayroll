import React, { useState } from "react";
import { Popover, Input, InputNumber, Button, message, Tooltip } from "antd";
import { InfoCircleOutlined, SyncOutlined } from "@ant-design/icons";
import * as Actions from "../../../Utils/redux/actions/payroll_apicall";
import TrainingStep from "../../Functional/ReactTour/TrainingStep";

export default function DriveTimeOverride(props) {
  const mins =
    props.drivetime.actual_time !== null
      ? props.drivetime.actual_time
      : props.drivetime.paid_time_allowable < props.drivetime.home_drive_time
      ? props.drivetime.paid_time_allowable
      : props.drivetime.home_drive_time;
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
    justification:
      props.drivetime.justification === ""
        ? "Cause I'm the boss"
        : props.drivetime.justification,
  });
  const [overRiding, setOverRiding] = useState(false);
  return (
    <Popover
      trigger="click"
      content={
        <>
          For the love of God why?
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
          <Button
            onClick={() => {
              setOverRiding(true);
              if (overRide.justification === "") {
                message.error(
                  "You must justify overriding the approved drive time"
                );
              } else {
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
            ghost
          >
            Override
          </Button>
        </>
      }
      title="Override"
    >
      <div style={{ cursor: "pointer" }}>
        <Tooltip
          title={
            <>
              Distance From Office
              <br />
              {props.drivetime.paid_time_allowable +
                60 +
                " mins/" +
                (props.drivetime.paid_distance_allowable + 60) +
                " mi."}
              <br />
              Distance From Home
              <br />
              {props.drivetime.home_drive_time +
                60 +
                " mins/" +
                (props.drivetime.home_drive_distance + 60) +
                " mi."}
              <br />
              {props.drivetime.justification}
            </>
          }
        >
          <TrainingStep
            title="Click here to over ride the drive time or distance."
            trainingName="content_drivetimeoverride_authorized"
          />
          <span className="content_drivetimeoverride_authorized">
            {(mins < 0 ? 0 : mins) +
              " mins/" +
              (miles < 0 ? 0 : miles) +
              " mi."}
          </p>
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
                {props.drivetime.justification}
              </>
            }
          >
            <TrainingStep
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
