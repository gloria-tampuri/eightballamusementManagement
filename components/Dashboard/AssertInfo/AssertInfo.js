import React from 'react'
import classes from './AssertInfo.module.css'
import useSWR from 'swr'
import {BiArrowBack, BiCurrentLocation} from 'react-icons/bi'
import { useRouter } from 'next/router'

const fetcher = (...args) => fetch(...args).then(res => res.json())


const AssertInfo = () => {
   const router = useRouter()
   const {assert}= router.query;
  

   const { data, error, isLoading } = useSWR( `/api/asserts/${assert}`,fetcher)

  const location=data?.assert?.location
  const current = location?.find((val)=>val.currentLocation===true)
 

  return (
    <div className={classes.assert}>

      <div className={classes.back} onClick={()=>router.back()}><BiArrowBack/>Back</div>
        <h2>{data?.assert?.assertId} {current?.locationName}</h2>

        <div className={classes.actions}>
        <div className={classes.actionbtn} onClick={() => router.push(`/dashboard/asserts/${assert}/cashup`)}>Cash Ups</div>
        <div className={classes.actionbtn} onClick={() => router.push(`/dashboard/asserts/${assert}/location`)}>Location</div>
      </div>
        {/* <div className={classes.actionbtn} onClick={() => router.push(`/dashboard/asserts/${assert}/expenditure`)}>Expenditure</div> */}

      <ul className={classes.summary}>
        <li>Assert Number: <span className={classes.emphasis}>{data?.assert?.assertId}</span></li>
        <li>Date Installed: <span className={classes.emphasis}>{data?.assert?.datePurchased}</span></li>
        <li>Current Location: <span className={classes.emphasis}>{current?.locationName}</span></li>
        <li>Current Site Tel:<span className={classes.emphasis}>{current?.telephoneNumber}</span> </li>
        <li>Current Tokens: <span className={classes.emphasis}>{current?.numberofTokens}</span></li>
        
      </ul>

    </div>
  )
}

export default AssertInfo