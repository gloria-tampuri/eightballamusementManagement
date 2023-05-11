import React from 'react'
import classes from './DashHeader.module.css'
import {BsSearch} from 'react-icons/bs'

const DashHeader = () => {
  return (
    <div className={classes.header}>
      <div className={classes.search}>
        <input type='text' placeholder='search here...'/>
        <BsSearch/>
      </div>
      <div className={classes.logout}>
        <h4>LOG OUT</h4>
      </div>
    </div>
  )
}

export default DashHeader