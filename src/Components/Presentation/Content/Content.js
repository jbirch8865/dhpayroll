import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Tooltip, Menu, Checkbox } from "antd";
import { FilterOutlined, MessageTwoTone } from "@ant-design/icons";
import WorkForceTable from "./WorkForceTable";
import { RightClick } from "./RightClick";
import { filters } from "../../Functional/Content/tableFilters";
import TagHeader from "./TagHeader";
import TrainingStep from "../../Functional/ReactTour/TrainingStep";
import * as Actions from "../../../Utils/redux/actions/payroll_apicall"
export default function Content(props) {
  const [viewMessageThread, setViewMessageThread] = useState(false);
  const [textFromNumber, setTextFromNumber] = useState("bulk");
  const [filteredData, setFilteredData] = useState([]);
  const [loadingWorkforce, setLoadingWorkforce] = useState(false);
  const [timecards,setTimecards] = useState([])
  const [previousShifts,setPreviousShifts] = useState([])
  const [loadingTimecards, setLoadingTimecards] = useState(false)

  const [selectedColumns, setSelectedColumns] = useState([
    "Name",
    "Phone",
    "Tags",
    "numberOfShifts",
    "missingTimecards"
  ]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        name: "Name",
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "30%",
        render: (text, record, index) => (
          <Dropdown
            overlay={
              <RightClick
                setViewMessageThread={setViewMessageThread}
                setTextFromNumber={setTextFromNumber}
              />
            }
            trigger={["contextMenu"]}
          >
            <div style={{ height: "100%", cursor: "select" }}>
              {record.first_name + " " + record.last_name}
            </div>
          </Dropdown>
        ),
        filterIcon: <><TrainingStep trainingImportance={0} title="Use the filter to see people missing timecards." trainingName="content_workforcetable_filter"/><FilterOutlined className="content_workforcetable_filter" /></>,
        filters: filters(props.data),
        onFilter: (value, record) => props.shifts.filter(shift => shift.shift_has_needs.filter(need => need.people_id === record.person_id).length > 0).length - props.shifts.filter(shift => shift.shift_has_needs.filter(need => need.people_id === record.person_id && timecards.filter(timecard => timecard.need_id === need.id).length > 0).length > 0).length > 0,
        sorter: (a, b) => a.first_name.localeCompare(b.first_name),
        sortDirections: ["ascend", "descend", "ascend"],
      },
      {
        name: "Phone",
        title: "Phone",
        dataIndex: "phone_number",
        key: "phone",
        width: "30%",
      },
      {
        name: "missingTimecards",
        title: "Missing Timecards",
        dataIndex: "",
        key: "missingTimecards",
        width: "30%",
        render: (text, record, index) => props.shifts.filter(shift => shift.shift_has_needs.filter(need => need.people_id === record.person_id).length > 0).length - props.shifts.filter(shift => shift.shift_has_needs.filter(need => need.people_id === record.person_id && timecards.filter(timecard => timecard.need_id === need.id).length > 0).length > 0).length
      },
      {
        name: "numberOfShifts",
        title: "# of Shifts",
        dataIndex: "",
        key: "numberOfShifts",
        width: "30%",
        render: (text, record, index) => typeof props.shifts !== "undefined" && (
              <p>
                {
                  props.shifts.filter((shift) => shift.shift_has_needs.filter(need => need.has_person !== null && need.has_person.person_id === record.person_id).length > 0).length
                }
              </p>
            )
      },
      {
        name: "driveTime",
        title: "Drive Time",
        dataIndex: "driveTime",
        key: "driveTime",
        width: "30%",
      },
      {
        name: "Tags",
        title: (
          <TagHeader
            setFilteredData={setFilteredData}
            setData={props.setData}
            setLoadingWorkforce={setLoadingWorkforce}
            columnChooserMenu={
              <Menu>
                <Menu.Item key="0">
                  <Checkbox
                    checked={selectedColumns.includes("missingTimecards")}
                    onChange={(e) => {
                      if(e.target.checked)
                      {
                        setSelectedColumns([
                          ...selectedColumns,
                          "missingTimecards",
                        ])
                      }else
                      {
                        setSelectedColumns(
                          selectedColumns.filter(
                            (column) => column !== "missingTimecards"
                          )
                        )
                      }
                    }}
                  >
                    Missing Timecards
                  </Checkbox>
                </Menu.Item>
                <Menu.Item key="1">
                  <Checkbox
                    checked={selectedColumns.includes("numberOfShifts")}
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedColumns([
                            ...selectedColumns,
                            "numberOfShifts",
                          ])
                        : setSelectedColumns(
                            selectedColumns.filter(
                              (column) => column !== "numberOfShifts"
                            )
                          )
                    }
                  >
                    # Of Shifts
                  </Checkbox>
                </Menu.Item>
              </Menu>
            }
          />
        ),
        dataIndex: "icons",
        key: "icons",
        width: "20%",
        render: (text, record, index) => <></>
      },
    ]);
    props.shifts.length !== 0 && JSON.stringify(previousShifts) !== JSON.stringify(props.shifts) && loadingTimecards === false && (setLoadingTimecards(true) || true) && Actions.getTimeCards(props.shifts.map(shift => shift.shift_has_needs.map(need => need.id)).flat()).then(response => {setTimecards(response.data.timecards);setLoadingTimecards(false)})
    setPreviousShifts([...props.shifts])
  }, [selectedColumns, props.data, props.shifts,timecards]);
  return (
    <Layout.Content>
      <WorkForceTable
        viewMessageThread={viewMessageThread}
        setViewMessageThread={setViewMessageThread}
        textFromNumber={textFromNumber}
        filteredData={filteredData}
        loadingWorkforce={loadingWorkforce}
        columns={columns.filter((column) =>
          selectedColumns.includes(column.name)
        )}
        data={props.data}
        setData={props.setData}
        shifts={props.shifts}
        timecards={timecards}
        setTimecards={setTimecards}
        loadingTimecards={loadingTimecards}
        setLoadingTimecards={setLoadingTimecards}
      />
    </Layout.Content>
  );
}
