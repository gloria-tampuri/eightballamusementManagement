import React from 'react'
import classes from './AssertInfo.module.css'
import useSWR from 'swr'
import {BiArrowBack, BiCurrentLocation} from 'react-icons/bi'
import { useRouter } from 'next/router'

const fetcher = (...args) => fetch(...args).then(res => res.json())


const AssertInfo = () => {
   const router = useRouter()
   const {assert}= router.query;
   console.log(router.query);

   const { data, error, isLoading } = useSWR( `/api/asserts/${assert}`,fetcher)
  console.log(data?.assert?.location);

  const location=data?.assert?.location
  const current = location?.find((val)=>val.currentLocation===true)
  console.log(current?.locationName);
 

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
        <li>Date Purchased: <span className={classes.emphasis}>{data?.assert?.datePurchased}</span></li>
        <li>Price Purchased: <span className={classes.emphasis}>{data?.assert?.purchasedPrice}</span></li>
        <li>Assert Condition: <span className={classes.emphasis}>{data?.assert?.assertState}</span></li>
        <li>Current Location: <span className={classes.emphasis}>{current?.locationName}</span></li>
        <li>Current Tokens: <span className={classes.emphasis}></span></li>
        <li>Cash Up for April: <span className={classes.emphasis}></span></li>
        <li>Expenditure for April: <span className={classes.emphasis}></span></li>



      </ul>

    </div>
  )
}

export default AssertInfo