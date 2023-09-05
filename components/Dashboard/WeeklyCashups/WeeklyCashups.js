import React,{useState, useEffect}from 'react'
import useSWR from 'swr'
import CashUp from '../CashUp/CashUp'
import Link from 'next/link'
import classes from './WeeklyCashups.module.css'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const WeeklyCashups = () => {

  const { data, error, isLoading } = useSWR('/api/asserts', fetcher);

  const allAssets = data?.asserts;
  console.log(allAssets);

  function getWeekNumber(date) {
    const currentDate = date || new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of the current year
    const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((days + 1) / 7);
  
    return weekNumber;
  }

  const calculateArrangeTotalSales = (documents) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentWeek = Math.ceil(
      (currentDate - new Date(currentDate.getFullYear(), 0, 1)) / 604800000
    ); // Calculate the current week number
  
    documents?.forEach((document) => {
      let totalSales = 0;
      document?.cashup?.forEach((sale) => {
        const saleDate = new Date(sale.cashupDate);
        const saleYear = saleDate.getFullYear();
        const saleWeek = Math.ceil(
          (saleDate - new Date(saleDate.getFullYear(), 0, 1)) / 604800000
        ); // Calculate the week number for the sale date
  
        if (saleYear === currentYear && saleWeek === currentWeek) {
          totalSales += sale.companyAmount;
        }
      });
  
      document.totalSalesCurrentWeek = totalSales || 0; // Set default value as 0 if totalSales is null or undefined
    });
  
    // Sort documents based on the total sales in the current week
    documents?.sort((a, b) => b.totalSalesCurrentWeek - a.totalSalesCurrentWeek);
  
    // Now documents array is sorted based on the total sales in the current week
    console.log(documents);
    return documents;
  };
  

const cashUpWeeklyTable = calculateArrangeTotalSales(allAssets)
  console.log(cashUpWeeklyTable);

  return (
    <div>
       <div className={classes.list}>
        <h2 className={classes.tabheader}>Performance of all assets of this week</h2>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>AssetID</th>
              <th>Location</th>
              <th>Cashup Amount</th>
            </tr>
          </thead>

          <tbody>
          {cashUpWeeklyTable?.map((arranged, index) => <tr key={arranged?._id}>
              <td>{index + 1}</td>
              <td>{arranged?.assertId}</td>
              <td>{arranged?.location.find((val) => val?.currentLocation === true)?.locationName}</td>

              <td>{arranged?.totalSalesCurrentWeek}</td>
            </tr>)}
            
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WeeklyCashups