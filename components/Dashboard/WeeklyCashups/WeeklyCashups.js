import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import classes from './WeeklyCashups.module.css';
import { useRouter } from 'next/router';

const fetcher = (...args) => fetch(...args).then(res => res.json());

const WeeklyCashups = () => {
  const { data, error } = useSWR('/api/asserts', fetcher);
  const router = useRouter();

  const currentDate = new Date(); // Current date and time
  const currentWeekStart = new Date(currentDate); // Start of the current week
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the most recent Sunday
  currentWeekStart.setHours(0, 0, 0, 0); // Set to midnight

  const currentWeekEnd = new Date(currentWeekStart); // End of the current week
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 6); // Add 7 days for a week
  currentWeekEnd.setHours(23, 59, 59, 999); // Set to the last millisecond of the day
let totalSum =0
  // Include all assets in the data for the current week, regardless of their cash-up amounts
  const currentWeekData = data?.asserts.map(assert => {
    const totalAmount = assert.cashup.reduce((total, sale) => {
      const saleDate = new Date(sale.cashupDate);
      if (saleDate >= currentWeekStart && saleDate <= currentWeekEnd) {
        total += sale.cashReceived;
      }
      return total;
    }, 0);
    totalSum += totalAmount
    return { ...assert, totalAmount };
  });

  // Sort the data in descending order of total cash-up amount
  currentWeekData?.sort((a, b) => b.totalAmount - a.totalAmount);

  

  return (
    <div>
      <div className={classes.list}>
      <button className='printButton' onClick={() => window.print()}>Print</button>
        <h2 className={classes.tabheader}>Performance of all assets for the current week. Total Amount: {totalSum}</h2>
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
            {currentWeekData?.map((assert, index) => (
              <tr onClick={() => router.push(`/dashboard/asserts/${assert?._id}/cashup `)} key={assert._id}>
                <td>{index + 1}</td>
                <td className={classes.color}>
                  {assert.location.find(val => val.currentLocation === true)?.locationName}
                </td>
                <td>{assert.assertId}</td>
                <td className={classes.color}>
                  {assert.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyCashups;
