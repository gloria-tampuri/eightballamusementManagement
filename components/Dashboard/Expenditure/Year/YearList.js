import React from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { BiArrowBack } from 'react-icons/bi'
import classes from './YearList.module.css'


const fetcher = (...args) => fetch(...args).then(res => res.json())

const YearList = () => {
    const router = useRouter()
  const {year}=router.query
  const { data, error } = useSWR(`/api/equipment/year/${year}`, fetcher,{refreshInterval: 1000})
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const groupedDataByYear = data?.expenditure.reduce((result, expen) => {
    const date = new Date(expen.cashupDate)
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    // const key = `${year}`;

    if (!result[year]) {
        result[year] = {}
    }
    if (!result[year][monthName]) {
        result[year][monthName] = []
    }
    result[year][monthName].push(expen);

    return result;

}, {})
console.log(groupedDataByYear);

  return (
    <div>
      <BiArrowBack className={classes.back} onClick={() => router.back()}/>
      <h1 className={classes.header}>List of Expenditure for {year}</h1>

    </div>
  )
}

export default YearList