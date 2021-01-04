import React, { useEffect } from "react"
import * as actions from "../../../Utils/redux/actions/reactTour"
import { connect } from "react-redux"

const GetUserCompletedTrainings = (props) => 
{
    useEffect(() => props.GetUserCompletedTrainings(),[])
    return <></>
}

const mapDispatchToProps = dispatch => {
  return {
    GetUserCompletedTrainings: (step,delay) => delay ? setTimeout(() => dispatch(actions.GetUserCompletedTrainings(step)),200) : dispatch(actions.GetUserCompletedTrainings(step)),
  }
}
const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(GetUserCompletedTrainings);
      