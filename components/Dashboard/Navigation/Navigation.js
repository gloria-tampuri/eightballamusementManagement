
import Link from 'next/link'
import classes from './Navigation.module.css'
import {MdOutlineDashboard,MdAssignmentAdd,MdOutlineWallet,MdClose} from 'react-icons/md'
import{FaCalendarWeek} from 'react-icons/fa'
import{GrClose}from 'react-icons/gr'
import{GiCardboardBoxClosed, GiExpense, GiHamburgerMenu} from 'react-icons/gi'
import { useState } from "react";
import { signUpWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "../../../auth";
import { useRouter } from 'next/router'


const Navigation = () => {
   const handleSignOut = async () => {
    try {
      await signOut();
      // Handle successful sign-out
      
    } catch (error) {
      // Handle sign-out error
    }
  };

  const[showNav,setShowNav]=useState(false)
  const navToogleHandler=()=>{
    setShowNav(!showNav)
  }
  return (
    <div  className={classes.navDisplay}>
       <div>
       <header className={classes.header}>
            <h1>8Ball Amusement</h1>
            <div className={classes.menu}>
              {showNav===false?<GiHamburgerMenu className={classes.icons} onClick={navToogleHandler}/>:<MdClose onClick={navToogleHandler} className={classes.icons}/>}
            </div>
            <hr/>
        </header>
        <div className={classes.nav} >
           <Link  className={classes.link} href='/dashboard'>
           <div className={classes.section}>
                <MdOutlineDashboard className={classes.icons}/>
                <span>Dashboard</span>
            </div>
           </Link>
            <Link  className={classes.link} href='/dashboard/addassert'>
            <div className={classes.section}>
                <MdAssignmentAdd className={classes.icons}/>
                <span>Add Asset</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/asserts'>
            <div className={classes.section}>
                <MdOutlineWallet className={classes.icons}/>
                <span>All Assets</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/weeklycashups'>
            <div className={classes.section}>
                <FaCalendarWeek className={classes.icons}/>
                <span>Weekly Cashups</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/expenditure'>
            <div className={classes.section}>
                <GiExpense className={classes.icons}/>
                <span>General Expenditure</span>
            </div>
            </Link>
            <div className={classes.logout}>
        <h4 onClick={handleSignOut}>LOG OUT</h4>
      </div>
            </div>

            {showNav === true?  <div className={classes.phoneNav} >
           <Link  className={classes.link} href='/dashboard'>
           <div className={classes.section}>
                <MdOutlineDashboard className={classes.icons}/>
                <span>Dashboard</span>
            </div>
           </Link>
            <Link  className={classes.link} href='/dashboard/addassert'>
            <div className={classes.section}>
                <MdAssignmentAdd className={classes.icons}/>
                <span>Add Assert</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/asserts'>
            <div className={classes.section}>
                <MdOutlineWallet className={classes.icons}/>
                <span>All Asserts</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/weeklycashups'>
            <div className={classes.section}>
                <FaCalendarWeek className={classes.icons}/>
                <span>Weekly Cashups</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/expenditure'>
            <div className={classes.section}>
                <GiExpense className={classes.icons}/>
                <span>General Expenditure</span>
            </div>
            </Link>
            <div className={classes.logout}>
        <h4 onClick={handleSignOut}>LOG OUT</h4>
      </div>
            </div>: ''}
           
       </div>
     
    </div>
  )
}

export default Navigation