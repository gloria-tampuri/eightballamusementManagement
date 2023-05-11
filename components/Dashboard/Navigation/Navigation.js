
import Link from 'next/link'
import classes from './Navigation.module.css'
import {MdOutlineDashboard, MdAddShoppingCart,MdOutlineCancelScheduleSend,MdPendingActions} from 'react-icons/md'

const Navigation = () => {
  return (
    <div>
         <header className={classes.header}>
            <h1>8Ball Amusement</h1>
            <hr/>
        </header>
        <div className={classes.nav} >
           <Link  className={classes.link} href='/dashboard'>
           <div className={classes.section}>
                <MdOutlineDashboard/>
                <span>Dashboard</span>
            </div>
           </Link>
            <Link  className={classes.link} href='/dashboard/addassert'>
            <div className={classes.section}>
                <MdAddShoppingCart/>
                <span>Add Assert</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/asserts'>
            <div className={classes.section}>
                <MdAddShoppingCart/>
                <span>All Asserts</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/expenditure'>
            <div className={classes.section}>
                <MdAddShoppingCart/>
                <span>General Expenditure</span>
            </div>
            </Link>
            </div>
    </div>
  )
}

export default Navigation