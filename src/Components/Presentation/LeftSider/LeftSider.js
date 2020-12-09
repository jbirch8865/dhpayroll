import React, { useState } from "react";
import { Menu, Layout } from "antd";
import NewRequestModal from "../NewRequest/NewRequestModal";
export default function LeftSider(props) {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [collapse,setCollapse] = useState(true)
  return (
    <Layout.Sider collapsible collapsed={collapse} onCollapse={setCollapse}>
      <Menu style={{ height: "86vh" }}>
      </Menu>
      {showNewRequest && <NewRequestModal show={showNewRequest} setShow={setShowNewRequest} />}
    </Layout.Sider>
  );
}
