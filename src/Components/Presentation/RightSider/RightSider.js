import React, {useState} from "react"
import {Menu,Layout} from "antd"

export default function RightSider(props)
{
    const [collapse,setCollapse] = useState(false)
    return <Layout.Sider collapsible collapsed={collapse} onCollapse={setCollapse}><Menu style={{height:'86vh'}}></Menu></Layout.Sider>
}