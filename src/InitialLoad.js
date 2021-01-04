import React from 'react'
import { useEffect } from 'react';
import * as Actions from './Utils/redux/actions/payroll_apicall'
import {connect} from 'react-redux'

function InitialLoad(props)
{
    useEffect(() => {
        props.getUserPreferences()
    },[])
    return <></>
}

const mapDispatchToProps = dispatch => {
    return {
        getUserPreferences:() => 
        dispatch(Actions.getUserPreferences())
    }
  }
  const mapStateToProps = (state) => {
    return {}
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(InitialLoad);
        