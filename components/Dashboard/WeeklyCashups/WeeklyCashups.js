import React,{useState, useEffect}from 'react'
import useSWR from 'swr'
import CashUp from '../CashUp/CashUp'
import Link from 'next/link'
import classes from './WeeklyCashups.module.css'
import { useRouter } from 'next/router'
const fetcher = (...args) => fetch(...args).then(res => res.json())

const WeeklyCashups = () => {
  const router=useRouter()
  const { data, error, isLoading } = useSWR('/api/asserts', fetcher);

  const allAssets = data?.asserts;

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
  
    // Calculate the previous week number
const previousWeekStartDate = new Date(currentDate);
previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7); // Subtract 7 days to get to the previous week's start date
const previousWeek = Math.ceil(
  (previousWeekStartDate - new Date(previousWeekStartDate.getFullYear(), 0, 1)) / 604800000
)

    documents?.forEach((document) => {
      let totalSales = 0;
      document?.cashup?.forEach((sale) => {
        const saleDate = new Date(sale.cashupDate);
        const saleYear = saleDate.getFullYear();
        const saleWeek = Math.ceil(
          (saleDate - new Date(saleDate.getFullYear(), 0, 1)) / 604800000
        ); // Calculate the week number for the sale date
  
        if (saleYear === currentYear && saleWeek === previousWeek) {
          totalSales += sale.companyAmount;
        }
      });
  
      document.totalSalesCurrentWeek = totalSales || 0; // Set default value as 0 if totalSales is null or undefined
    });
  
    // Sort documents based on the total sales in the current week
    documents?.sort((a, b) => b.totalSalesCurrentWeek - a.totalSalesCurrentWeek);
  
    // Now documents array is sorted based on the total sales in the current week
    return documents;
  };
  
 
  

const cashUpWeeklyTable = calculateArrangeTotalSales(allAssets)

  return (
    <div>
       <div className={classes.list}>
        <h2 className={classes.tabheader}>Performance of all assets of this week</h2>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Location</th>
              <th>AssetID</th>
              <th>Cashup Amount</th>
            </tr>
          </thead>

          <tbody>
          {cashUpWeeklyTable?.map((arranged, index) => <tr key={arranged?._id} onClick={()=>router.push(`/dashboard/asserts/${arranged?._id}/cashup `)} >
              <td>{index + 1}</td>
              <td className={classes.color}>{arranged?.location.find((val) => val?.currentLocation === true)?.locationName}</td>
              <td>{arranged?.assertId}</td>

              <td className={classes.color}>{arranged?.totalSalesCurrentWeek}</td>
            </tr>)}
            
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WeeklyCashups


// import React, { useState, useEffect } from 'react';
// import useSWR from 'swr';
// import CashUp from '../CashUp/CashUp';
// import Link from 'next/link';
// import classes from './WeeklyCashups.module.css';

// const fetcher = (...args) => fetch(...args).then(res => res.json());

// const WeeklyCashups = () => {
//   const { data, error, isLoading } = useSWR('/api/asserts', fetcher);
//   const allAssets = data?.asserts;

//   function getWeekNumber(date) {
//     const currentDate = date || new Date();
//     const startDate = new Date(currentDate.getFullYear(), 0, 1); // January 1st of the current year
//     const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
//     const weekNumber = Math.ceil((days + 1) / 7);

//     return weekNumber;
//   }

//   const calculateArrangeTotalSales = (documents, currentDate) => {
//     const currentYear = currentDate.getFullYear();

//     // Calculate the start and end dates for the current week (from 11th September to 17th September 2023)
//     const currentWeekStart = new Date(2023, 8, 11); // September is 8 (0-based index)
//     const currentWeekEnd = new Date(2023, 8, 17); // End of September 17th

//     const filteredDocuments = documents?.filter((document) => {
//       return document.cashup.some((sale) => {
//         const saleDate = new Date(sale.cashupDate);
//         const saleYear = saleDate.getFullYear();

//         return (
//           saleYear === currentYear &&
//           saleDate >= currentWeekStart &&
//           saleDate <= currentWeekEnd
//         );
//       });
//     });

//     const arrangedDocuments = filteredDocuments?.map((document) => {
//       let totalSales = 0;

//       document.cashup.forEach((sale) => {
//         const saleDate = new Date(sale.cashupDate);
//         const saleYear = saleDate.getFullYear();

//         if (
//           saleYear === currentYear &&
//           saleDate >= currentWeekStart &&
//           saleDate <= currentWeekEnd
//         ) {
//           totalSales += sale.companyAmount;
//         }
//       });

//       return {
//         ...document,
//         totalSalesCurrentWeek: totalSales || 0,
//       };
//     });

//     // Sort documents based on the total sales in the current week
//     arrangedDocuments?.sort((a, b) => b.totalSalesCurrentWeek - a.totalSalesCurrentWeek);

//     return arrangedDocuments;
//   };

//   const currentDate = new Date();
//   const cashUpWeeklyTable = calculateArrangeTotalSales(allAssets, currentDate);

//   return (
//     <div>
//       <div className={classes.list}>
//         <h2 className={classes.tabheader}>Performance of all assets for the week of September 11th to September 17th, 2023</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Position</th>
//               <th>Location</th>
//               <th>AssetID</th>
//               <th>Cashup Amount</th>
//             </tr>
//           </thead>

//           <tbody>
//             {cashUpWeeklyTable?.map((arranged, index) => (
//               <tr key={arranged?._id}>
//                 <td>{index + 1}</td>
//                 <td className={classes.color}>{arranged?.location.find((val) => val?.currentLocation === true)?.locationName}</td>
//                 <td>{arranged?.assertId}</td>
//                 <td className={classes.color}>{arranged?.totalSalesCurrentWeek}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default WeeklyCashups;


