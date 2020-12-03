import { Table, Input } from "antd";
import React, { useState } from "react";
import MessageThread from "./MessageThread";
import * as Actions from "../../../Utils/redux/actions/personnel_apicall";

const CommunicationTable = (props) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");

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
                    person.has_skills.filter((skill) =>
                      skill.skill.Name.toLowerCase().includes(
                        value.toLowerCase()
                      )
                    ).length > 0 ||
                    (value.toLowerCase() === "unread" &&
                      person.has_sent_sms.length > 0) ||
                    person.phone_number.includes(value)
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
                          return []
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
                    (value.toLowerCase() === "unread" &&
                      person.has_sent_sms.length > 0) ||
                    person.has_skills.filter((skill) =>
                      skill.skill.Name.toLowerCase().includes(
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
  
  return (
    <>
      <Input.Search
        style={{ margin: "0 0 10px 0" }}
        placeholder="Search by..."
        onChange={(e) => searchWorkforce(e.target.value)}
        value={searchValue}
        onSearch={searchWorkforce}
      />
      <Table
        rowSelection={{
          onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys),
          selectedRowKeys: selectedRows,
          preserveSelectedRowKeys: true,
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
