
import Link from 'next/link'
import classes from './Navigation.module.css'
import {MdOutlineDashboard,MdAssignmentAdd,MdOutlineWallet,MdClose} from 'react-icons/md'
import { getSignedInEmail } from '../../../auth';
import { MdEmojiTransportation } from "react-icons/md";

import{FaCalendarWeek} from 'react-icons/fa'
import{GrClose}from 'react-icons/gr'
import{GiCardboardBoxClosed, GiExpense, GiHamburgerMenu} from 'react-icons/gi'
import { useEffect, useState } from "react";
import { signUpWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "../../../auth";
import { useRouter } from 'next/router'
import { FaTasks } from "react-icons/fa";



const Navigation = () => {
   const handleSignOut = async () => {
    try {
      await signOut();
      // Handle successful sign-out
      
    } catch (error) {
      // Handle sign-out error
    }
  };
  const[admin, setAdmin]= useState(false)
  useEffect(() => {
    // Check if the signed-in email is the admin email
    getSignedInEmail()
        .then((email) => {
            if (email === 'richard.ababio@eightball.com') {
                setAdmin(true);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}, []);
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
        { admin? <div className={classes.nav} >
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
            <Link  className={classes.link} href='/dashboard/todo'>
            <div className={classes.section}>
                <FaTasks className={classes.icons}/>
                <span>Todo List</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/transport'>
            <div className={classes.section}>
                <MdEmojiTransportation className={classes.icons}/>
                <span>Transport</span>
            </div>
            </Link>
            <div className={classes.logout}>
        <h4 onClick={handleSignOut}>LOG OUT</h4>
      </div>
            </div>: <div className={classes.nav}>
            <Link  className={classes.link} href='/dashboard'>
           <div className={classes.section}>
                <MdOutlineDashboard className={classes.icons}/>
                <span>Dashboard</span>
            </div>
           </Link>
           <Link  className={classes.link} href='/dashboard/weeklycashups'>
            <div className={classes.section}>
                <FaCalendarWeek className={classes.icons}/>
                <span>Weekly Cashups</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/transport'>
            <div className={classes.section}>
                <MdEmojiTransportation className={classes.icons}/>
                <span>Transport</span>
            </div>
            </Link>
            <div className={classes.logout}>
        <h4 onClick={handleSignOut}>LOG OUT</h4>
      </div>
              </div>}

            {showNav === true? 
             <div>
              <div className={classes.phoneNav} >
              {admin? <div className='admin'>
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
            <Link  className={classes.link} href='/dashboard/todo'>
            <div className={classes.section}>
                <FaTasks className={classes.icons}/>
                <span>Todo List</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/transport'>
            <div className={classes.section}>
                <MdEmojiTransportation className={classes.icons}/>
                <span>Transport</span>
            </div>
            </Link>
            <div className={classes.logout}>
        <h4 onClick={handleSignOut}>LOG OUT</h4>
      </div>
                </div>: <div> <Link  className={classes.link} href='/dashboard'>
           <div className={classes.section}>
                <MdOutlineDashboard className={classes.icons}/>
                <span>Dashboard</span>
            </div>
           </Link>
           <Link  className={classes.link} href='/dashboard/weeklycashups'>
            <div className={classes.section}>
                <FaCalendarWeek className={classes.icons}/>
                <span>Weekly Cashups</span>
            </div>
            </Link>
            <Link  className={classes.link} href='/dashboard/transport'>
            <div className={classes.section}>
                <MdEmojiTransportation className={classes.icons}/>
                <span>Transport</span>
            </div>
            </Link>
            <div className={classes.logout}>
        <h4 onClick={handleSignOut}>LOG OUT</h4>
      </div>
              </div>}
            </div>
            </div>: ''}
           
       </div>
     
    </div>
  )
}

export default Navigation