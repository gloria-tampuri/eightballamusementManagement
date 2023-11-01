import React from 'react'

const hhg = () => {
  return (
    <div> <select name='month' id='month-select' onChange={selectedMonthHandler}>
    <option className={classes.opt} value=''>Choose Month</option>
    <option className={classes.opt} value='January'>January</option>
    <option className={classes.opt} value='February'>February</option>
    <option className={classes.opt} value='March'>March</option>
    <option className={classes.opt} value='April'>April</option>
    <option className={classes.opt} value='May'>May</option>
    <option className={classes.opt} value='June'>June</option>
    <option className={classes.opt} value='July'>July</option>
    <option className={classes.opt} value='August'>August</option>
    <option className={classes.opt} value='September'>September</option>
    <option className={classes.opt} value='October'>October</option>
    <option className={classes.opt} value='November'>November</option>
    <option className={classes.opt} value='December'>December</option>
  </select></div>
  )
}

export default hhg