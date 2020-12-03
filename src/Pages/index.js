import React, { useState } from "react";
import { Layout } from "antd";
import Avatar from "../Components/Presentation/Avatar/Avatar";
import LeftSider from "../Components/Presentation/LeftSider/LeftSider";
import RightSider from "../Components/Presentation/RightSider/RightSider";
import Content from "../Components/Presentation/Content/Content";

const { Header, Footer } = Layout;
export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <Layout>
      <Header style={{ height: "7vh" }}>
        <div style={{ float: "right", marginTop:"-13px" }}>
          <Avatar darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </Header>
      <Layout>
        <LeftSider />
        <Content />
        <RightSider />
      </Layout>
      <Footer style={{ height: "7vh" }}></Footer>
    </Layout>
  );
}
