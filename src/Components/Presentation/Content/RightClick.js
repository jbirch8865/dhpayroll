import React from 'react'
import {Menu} from 'antd'
export const RightClick = (props) => {
    return (
      <Menu>
        <Menu.SubMenu title="SMS Messages">
          {/* <Menu.Item
          onClick={e => {
//            setSelectedRows(new Set([...selectedRows, record.key]))
            setViewMessageThread(true)
            setTextFromNumber('job')
          }}
        >
          Job Details
        </Menu.Item>
        <Menu.Item
          onClick={e => {
//            setSelectedRows(new Set([...selectedRows, record.key]))
            setViewMessageThread(true)
            setTextFromNumber('schedule')
          }}
        >
          Scheduling
        </Menu.Item> */}
          <Menu.Item
            onClick={(e) => {
              //            setSelectedRows(new Set([...selectedRows, record.key]))
              props.setViewMessageThread(true);
              props.setTextFromNumber("bulk");
            }}
          >
            Announcements
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    );
  };
