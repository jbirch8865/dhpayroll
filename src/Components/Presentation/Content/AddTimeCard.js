import React, { useState, useEffect, useRef } from "react";
import { Upload, message, Checkbox, Spin } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as Actions from "../../../Utils/redux/actions/payroll_apicall";
import { getBackendAzureADUserAccessToken } from "../../../Utils/api";

export default function AddTimeCard(props) {
  const [timeCardSubmitted, setTimeCardSubmitted] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false)
  useEffect(() => {
    const fileList = props.timecards.filter(timecard => timecard.need_id === props.need_id)
    fileList.map(timecard => 
    setTimeCardSubmitted({
      need_id: timecard.need_id,
      uid: timecard.id,
      name: timecard.description,
      status: "done",
      response: { status: "success", timecard: { id: timecard.id } },
    }))
    fileList.length === 0 && setTimeCardSubmitted(false)
  }, [props.timecards]);
// const uploadProps = {
  //   name: "file",
  //   multiple: false,
  //   action: process.env.REACT_APP_PAYROLL_URI + "/api/timecards",
  //   data: (file) => {
  //     return {
  //       need_id: props.need_id,
  //       people_id: props.get_key,
  //       description: file.name,
  //     };
  //   },
  //   headers: {
  //     Authorization: token,
  //   },
  //   onChange(info) {
  //     console.log(info);
  //     const { status } = info.file;
  //     if (status !== "uploading") {
  //     }
  //     if (status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully.`);
  //       console.log(info.file);
  //       setFileList([...fileList, info.file]);
  //     } else if (status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   onRemove(file) {
  //     Actions.deleteTimeCard(file.response.timecard.id);
  //     setFileList(fileList.filter((file1) => file1.name !== file.name));
  //     message.error(`${file.name} file removed.`);
  //   },
  //   beforeUpload: () => message.info("uploading file"),
  //   fileList,
// };
  /*
return (<Upload.Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
    </Upload.Dragger>)
*/
  return props.loadingTimecards || singleLoading ? (
    <Spin />
  ) : (
    <Checkbox
      checked={timeCardSubmitted}
      loading={true}
      onChange={(checked) => {
        setSingleLoading(true);
        if (checked.target.checked) {
          Actions.addTimeCard(
            props.need_id,
            props.person_id,
            "checked box"
          ).then((response) =>
            Actions.getTimeCards(
              props.shifts
                .map((shift) => shift.needs.map((need) => need.get_key))
                .flat()
            ).then((response) => {props.setTimecards(response.data.timecards);setSingleLoading(false)})
          );
        } else {
            Actions.deleteTimeCard(timeCardSubmitted.uid).then((response) =>
              Actions.getTimeCards(
                props.shifts
                  .map((shift) => shift.needs.map((need) => need.get_key))
                  .flat()
              ).then((response) => {props.setTimecards(response.data.timecards);setSingleLoading(false)})
            )
        }
      }}
    />
  );
}
