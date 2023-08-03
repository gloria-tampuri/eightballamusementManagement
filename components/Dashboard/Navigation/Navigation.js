
import Link from 'next/link'
import classes from './Navigation.module.css'
import {MdOutlineDashboard,MdAssignmentAdd,MdOutlineWallet,} from 'react-icons/md'
import{GiExpense} from 'react-icons/gi'
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
  return (
    <div  className={classes.navDisplay}>
       <div>
       <header className={classes.header}>
            <h1>8Ball Amusement</h1>
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
                <span>Add Assert</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/asserts'>
            <div className={classes.section}>
                <MdOutlineWallet className={classes.icons}/>
                <span>All Asserts</span>
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
           
       </div>
     
    </div>
  )
}

export default Navigation