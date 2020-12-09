import React, { useState, useEffect } from "react";
import { Menu, Layout } from "antd";
import { DatePicker } from "antd";
import moment from "moment";
import { CalendarOutlined } from "@ant-design/icons";
import "./style.css";
import * as Actions from "../../../Utils/redux/actions/personnel_apicall";
import TrainingStep from "../../Functional/ReactTour/TrainingStep";
export default function RightSider(props) {
  const [collapse, setCollapse] = useState(false);
  const [dates, setDates] = useState([]);
  const [hackValue, setHackValue] = useState();
  const [value, setValue] = useState([moment().day(-6), moment().day(0)]);
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], "days") > 6;
    const tooEarly = dates[1] && dates[1].diff(current, "days") > 6;
    return tooEarly || tooLate;
  };

  const onOpenChange = (open) => {
    if (open) {
      setHackValue([]);
      setDates([]);
    } else {
      setHackValue(undefined);
    }
  };
  useEffect(() => {
    Actions.getShiftDetails(
      value[0].format("YYYY-MM-DD"),
      value[1].format("YYYY-MM-DD")
    ).then((results) => props.setShifts(results.data.shifts));
  }, [value]);
  return (
    <Layout.Sider collapsible collapsed={collapse} onCollapse={setCollapse}>
      <Menu style={{ height: "86vh" }}>
        <Menu.Item key="0" icon={<CalendarOutlined />}>
          <TrainingStep
            title="Click to pick the week you want to look at."
            trainingName="rightsider_rightsider_date_picker"
          />
          <DatePicker.RangePicker
            ranges={{
              "Past Payroll": [moment().day(-6), moment().day(0)],
              "Current Payroll": [
                moment().startOf("isoWeek"),
                moment().endOf("isoWeek"),
              ],
            }}
            className="rightsider_rightsider_date_picker"
            value={hackValue || value}
            disabledDate={disabledDate}
            onCalendarChange={(val) => setDates(val)}
            onChange={(val) => setValue(val)}
            onOpenChange={onOpenChange}
            allowClear={false}
          />
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
}
