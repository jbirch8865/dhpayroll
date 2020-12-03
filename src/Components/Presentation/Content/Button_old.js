import { Drawer, Button } from "antd"
import React, { useState } from "react"
import { connect } from "react-redux"
import WorkForceTable from "./WorkForceTable"
function CompanyStaff(props) {
  const [viewDrawer, setViewDrawer] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setViewDrawer(true)
        }}
        type="primary"
        shape="round"
        size="large"
      >
        Work Force
      </Button>
      <Drawer
        drawerStyle={{
          backgroundColor:"#d4ebf2"
        }}
        title="Workforce Manager"
        placement="right"
        closable={false}
        onClose={() => {
          setViewDrawer(false)
        }}
        visible={viewDrawer}
        width="650px"
      >
        <WorkForceTable />
      </Drawer>
    </>
  )
}

const mapStateToProps = state => {
  return {}
}
export default connect(mapStateToProps)(CompanyStaff)
