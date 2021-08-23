import {Table, Input, Spin, Alert, Tooltip} from "antd";
import React, { useState, useRef, useEffect } from "react";
import MessageThread from "./MessageThread";
import * as Actions from "../../../Utils/redux/actions/payroll_apicall";
import AddTimeCard from "./AddTimeCard";
import DriveTimeOverride from "./DriveTimeOverride";
import TrainingStep from "../../Functional/ReactTour/TrainingStep";
import {CloseCircleTwoTone, MinusCircleOutlined, PlusSquareOutlined, SyncOutlined} from "@ant-design/icons";
import { getTwoToneColor, setTwoToneColor } from '@ant-design/icons';
const CommunicationTable = (props) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [driveTime, setDriveTime] = useState({});
  const driveRef = useRef({});
  const searchWorkforce = (value) => {
    setSearchValue(value);
    if (value === "") {
      props.setData([...props.filteredData]);
    } else {
      if (value.includes("&&")) {
        const andSearchValues = value.split("&&");
        const andFilteredSearchResults = [
          ...new Map(
            andSearchValues
              .map((value) =>
                props.filteredData.filter(
                  (person) =>
                    person.first_name
                      .concat(" ")
                      .concat(person.last_name)
                      .toLowerCase()
                      .includes(value.toLowerCase()) ||
                    person.skills.filter((skill) =>
                      skill.Name.toLowerCase().includes(
                        value.toLowerCase()
                      )
                    ).length > 0
                )
              )
              .map((group, index, array) => {
                if (index === 0) {
                  return group
                    .map((person) => {
                      return array
                        .map((subgroup, subindex) => {
                          if (subindex !== 0) {
                            if (subgroup.includes(person)) {
                              return person;
                            }
                          }
                          return [];
                        })
                        .flat();
                    })
                    .flat();
                }
                return [];
              })
              .flat()
              .map((person) => {
                if (typeof person !== "undefined") {
                  return [person["key"], person];
                } else {
                  return [];
                }
              })
          ).values(),
        ].filter((person) => typeof person !== "undefined");
        props.setData(andFilteredSearchResults);
      } else {
        const orSearchValues = value.split("::");
        const orFilteredSearchResults = [
          ...new Map(
            orSearchValues
              .map((value) =>
                props.filteredData.filter(
                  (person) =>
                    person.first_name
                      .concat(" ")
                      .concat(person.last_name)
                      .toLowerCase()
                      .includes(value.toLowerCase()) ||
                    person.skills.filter((skill) =>
                      skill.Name.toLowerCase().includes(
                        value.toLowerCase()
                      )
                    ).length > 0 ||
                    person.phone_number.includes(value)
                )
              )
              .flat()
              .map((person) => [person["key"], person])
          ).values(),
        ];
        props.setData(orFilteredSearchResults);
      }
    }
  };
  setTwoToneColor('#FF0000');
  function loadingDriveTime(needs) {
    needs.map(
      (need_id) =>
        (driveRef.current = {
          ...driveRef.current,
          [need_id]: <Spin />,
        })
    );
    setDriveTime({ ...driveRef.current });
    return true;
  }

    function driveTimesFailed(needs) {
        needs.map(
            (need_id) =>
                (driveRef.current = {
                    ...driveRef.current,
                    [need_id]: <><Tooltip title={"There was an error getting drive times from google.  Please try clicking the refresh button.  If that doesn't work let Joel know."}>
                                    <CloseCircleTwoTone />
                                </Tooltip><SyncOutlined
            onClick={() =>
                getDriveTime(
                    null,
                    [need_id],
                    true
                )
            }
        /></>,
                })
        );
        setDriveTime({ ...driveRef.current });
        return true;
    }

    const getDriveTime = (rowId, needs, override_google) => {
    loadingDriveTime(needs);
    Actions.getDriveTime(needs, override_google)
      .then((response) => {
        if (response !== false) {
          response.data.drivetimes.map((drivetime) => {
            driveRef.current = {
              ...driveRef.current,
              [drivetime.need_id]: (
                <DriveTimeOverride
                  drivetime={drivetime}
                  getDriveTime={getDriveTime}
                />
              ),
            };
            setDriveTime({ ...driveRef.current });
          });
        }
      })
      .catch((error) => {
          driveTimesFailed(needs)
        // let retrySeconds = ++retries[rowId] * 1000;
        // console.log(
        //   "retrying after " +
        //     retrySeconds +
        //     " seconds currently on " +
        //     retries[rowId] +
        //     " attempt"
        // );
        // retries[rowId] < maxRetries
        //   ? setTimeout(
        //       () => getDriveTime(rowId, needs, override_google),
        //       retrySeconds
        //     )
        //   : needs.map(
        //       (need_id) =>
        //         (driveRef.current = {
        //           ...driveRef.current,
        //           [need_id]: <Alert message="No Response" type="error" />,
        //         })
        //     );
        // setDriveTime({ ...driveRef.current });
      });
  };

  useEffect(() => {
    let numOfCalls = 0;
    props.data.map((person) => {
        console.log(person)
      let needs1 = [];
      props.shifts.map((shift) =>
        shift.needs.map(
          (need) =>
            console.log(need) || need.people_id === person.get_key &&
            typeof driveTime[need.get_key] === "undefined" &&
            needs1.push(need.get_key)
        )
      );
      if (needs1.length > 0) {
        setTimeout(
          () => getDriveTime(person.get_key, needs1, false),
          process.env.NODE_ENV === "development"
            ? numOfCalls++ * 15000
            : numOfCalls++ * 3000
        );
      }
    });
  }, [props.shifts]);

  return (
    <>
      <TrainingStep
        trainingImportance={0}
        title="You can search by employee name, number or skill."
        trainingName="content_workforcetable_search"
      />
      <Input.Search
        className="content_workforcetable_search"
        style={{ margin: "0 0 10px 0" }}
        placeholder="Search by..."
        onChange={(e) => searchWorkforce(e.target.value)}
        value={searchValue}
        onSearch={searchWorkforce}
      />
      <Table
        // rowSelection={{
        //   onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys),
        //   selectedRowKeys: selectedRows,
        //   preserveSelectedRowKeys: true,
        // }}
        expandable={{
          defaultExpandedRowKeys: [],
          expandedRowRender: (record) => {
            // const getDriveTime = (rowId, needs, override_google) => {
            //   retries = !retries.hasOwnProperty(rowId)
            //     ? { ...retries, [rowId]: 0 }
            //     : { ...retries };
            //   loadingDriveTime(needs);
            //   Actions.getDriveTime(needs, override_google)
            //     .then((response) => {
            //       if (response !== false) {
            //         response.data.drivetimes.map((drivetime) => {
            //           driveRef.current = {
            //             ...driveRef.current,
            //             [drivetime.need_id]: (
            //               <DriveTimeOverride
            //                 drivetime={drivetime}
            //                 getDriveTime={getDriveTime}
            //               />
            //             ),
            //           };
            //           setDriveTime({ ...driveRef.current });
            //         });
            //       }
            //     })
            //     .catch((error) => {
            //       let retrySeconds =
            //         Math.floor(Math.random() * (40 - 10 + 10) + 10) * 100;
            //       ++retries[rowId] < maxRetries
            //         ? setTimeout(
            //             () => getDriveTime(rowId, needs, override_google),
            //             retrySeconds
            //           )
            //         : needs.map(
            //             (need_id) =>
            //               (driveRef.current = {
            //                 ...driveRef.current,
            //                 [need_id]: (
            //                   <Alert message="No Response" type="error" />
            //                 ),
            //               })
            //           );
            //       setDriveTime({ ...driveRef.current });
            //     });
            // };
            let needs1 = [];
            props.shifts.map((shift) =>
              shift.needs.map(
                (need) =>
                  need.people_id === record.get_key &&
                  typeof driveTime[need.get_key] === "undefined" &&
                  needs1.push(need.get_key)
              )
            );
            if (needs1.length > 0) {
              getDriveTime(record.get_key, needs1, false);
            }
            const columns = [
              {
                name: "date",
                title: "Date",
                dataIndex: "date",
                key: "date",
                width: "15%",
                sorter: (a, b) => new Date(b.date) - new Date(a.date),
                sortDirections: ["ascend", "descend", "ascend"],
              },
              {
                name: "Customer",
                title: "Customer",
                dataIndex: "Name",
                key: "name",
                width: "25%",
                render: (text, record) =>
                  record.contractor.company[0].customer_name,
              },
              {
                name: "Location",
                title: "Location",
                dataIndex: "location",
                key: "location",
                render: (text, record) =>
                  record.address.street_address,
                width: "30%",
              },
              {
                name: "driveTime",
                title: <>Drive Time</>,
                dataIndex: "driveTime",
                key: "driveTime",
                width: "15%",
                render: (text, rowRecord, index) => {
                  return driveTime[
                    rowRecord.needs.filter(
                      (need) => need.people_id === record.get_key
                    )[0].get_key
                  ];
                },
              },
              {
                name: "actions",
                title: "Timecard Received",
                dataIndex: "actions",
                key: "actions",
                width: "15%",
                render: (text, rowRecord, index) => (
                  <AddTimeCard
                    need_id={
                      rowRecord.needs.filter(
                        (need) => need.people_id === record.get_key
                      )[0].get_key
                    }
                    person_id={record.get_key}
                    timecards={props.timecards}
                    setTimecards={props.setTimecards}
                    shifts={props.shifts}
                    loadingTimecards={props.loadingTimecards}
                    setLoadingTimecards={props.setLoadingTimecards}
                  />
                ),
              },
            ];
            const data = props.shifts.filter(
              (shift) =>
                shift.needs.filter(
                  (need) => need.people_id === record.get_key
                ).length > 0
            );
            return <Table dataSource={data} columns={columns} />;
          },
          expandIcon: ({ expanded, onExpand, record }) =>
          props.shifts
          .filter(
            (shift) =>
              shift.needs.filter(
                (need) => need.people_id === record.get_key
              ).length > 0
          )
          .flat().length ? (expanded ? (
            <MinusCircleOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <>
                {/*<TrainingStep*/}
                {/*  trainingImportance={0}*/}
                {/*  title="Expand to see shifts worked and which ones have timecards received."*/}
                {/*  trainingName="content_workforcetable_expand"*/}
                {/*/>*/}
              <PlusSquareOutlined onClick={e => onExpand(record, e)} className="content_workforcetable_expand"/></>
          )) : <></>
        }}
        columns={props.columns}
        dataSource={props.data}
        pagination={false}
        loading={props.loadingWorkforce}
        scroll={{ y: "75vh" }}
      />
      <MessageThread
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        viewMessageThread={props.viewMessageThread}
        setViewMessageThread={props.setViewMessageThread}
        data={props.data}
        textFromNumber={props.textFromNumber}
      />
    </>
  );
};

export default CommunicationTable;
