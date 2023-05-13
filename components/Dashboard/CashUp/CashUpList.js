import React from 'react'
import classes from './List.module.css'
import useSWR from 'swr'
import { useRouter } from 'next/router'
const fetcher = (...args) => fetch(...args).then(res => res.json())

const CashUpList = () => {
    const router = useRouter()
  const {assert}=router.query

    const { data, error } = useSWR(`/api/asserts/${assert}`, fetcher,{refreshInterval: 1000})
    
    return (
        <div>
            <div className={classes.list}>
            <table>
            <thead>
             <tr>
                 <th>Date</th>
                 <th>Tokens Played</th>
                 <th>Percentage</th>
                 <th>Total Amount</th>
                 <th>Site Amount</th> 
                 <th>Comany Amount</th>               
             </tr>
         </thead>

         <tbody>
            {data && data?.assert?.cashup.map((cash)=><tr key={cash.cashupId}>
            <td>{cash.date}</td>
            <td>{cash.numberOfTokensPlayed}</td>
            <td>{cash.percentage}</td>
            <td>{cash.totalAmount}</td>
            <td>{cash.siteAmount}</td>
            <td>{cash.companyAmount}</td>
            </tr>)}
         </tbody>
            </table>
            </div>
        </div>
    )
}

export default CashUpList