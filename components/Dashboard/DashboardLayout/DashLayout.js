import React from 'react'
import classes from './DashLayout.module.css'
import DashHeader from '../DashHeader/DashHeader'
import Navigation from '../Navigation/Navigation'
// import '../print.css'

const DashLayout = ({children}) => {
  return (
    <div className={classes.dashboard}>
    <div className={`${classes.nav} no-print`}>
        <Navigation/>
    </div>
    <div className={classes.other}>
        <div className={classes.main}>
        {children}
        </div>
    </div>
</div>
  )
}

export default DashLayout