import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Tooltip, Menu, Checkbox } from "antd";
import { MessageTwoTone } from "@ant-design/icons";
import WorkForceTable from "./WorkForceTable";
import { RightClick } from "./RightClick";
import { filters } from "../../Functional/Content/tableFilters";
import TagHeader from "./TagHeader";
export default function Content(props) {
  const [data, setData] = useState([]);
  const [viewMessageThread, setViewMessageThread] = useState(false);
  const [textFromNumber, setTextFromNumber] = useState("bulk");
  const [filteredData, setFilteredData] = useState([]);
  const [loadingWorkforce, setLoadingWorkforce] = useState(false);
  const [selectedColumns,setSelectedColumns] = useState(["Name","Phone","Tags"])
  const [columns,setColumns] = useState([])

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
          filters: filters(data),
          onFilter: (value, record) => record.has_skills.filter(has_skill => has_skill.skill.Name === value).length > 0,
          sorter: (a, b) => a.first_name.localeCompare(b.first_name),
          sortDirections: ['ascend', 'descend', 'ascend'],
        },
      {
          name: "Phone",
          title: "Phone",
          dataIndex: "phone_number",
          key: "phone",
          width: "30%",
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
              setData={setData}
              setLoadingWorkforce={setLoadingWorkforce}
              columnChooserMenu={<Menu>
                <Menu.Item key="0">
                  <Checkbox
                    checked={selectedColumns.includes('driveTime')}
                    onChange={(e) => e.target.checked ? setSelectedColumns([...selectedColumns,"driveTime"]) : setSelectedColumns(selectedColumns.filter(column => column !== "driveTime"))}
                  >
                    Drive Time
                  </Checkbox>
                </Menu.Item>
              </Menu>
              }
            />
          ),
          dataIndex: "unread",
          key: "unread",
          width: "20%",
          render: (text, record, index) =>
            record.has_sent_sms.length > 0 ? (
              <Tooltip title="Unread Message">
                <MessageTwoTone />
              </Tooltip>
            ) : (
              <></>
            ),
        },
    ])
  }, [selectedColumns,data]);
  // Date/Company/Location/DriveTime
  return (
    <Layout.Content>
      <WorkForceTable
        viewMessageThread={viewMessageThread}
        setViewMessageThread={setViewMessageThread}
        textFromNumber={textFromNumber}
        filteredData={filteredData}
        loadingWorkforce={loadingWorkforce}
        columns={columns.filter(column => selectedColumns.includes(column.name))}
        data={data}
        setData={setData}
      />
    </Layout.Content>
  );
}
