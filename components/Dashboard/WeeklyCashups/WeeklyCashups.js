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
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 7); // Add 7 days for a week
  currentWeekEnd.setHours(23, 59, 59, 999); // Set to the last millisecond of the day

  // Filter and map the data for the current week
  const currentWeekData = data?.asserts.filter(assert => {
    return assert.cashup.some(sale => {
      const saleDate = new Date(sale.cashupDate);
      return saleDate >= currentWeekStart && saleDate <= currentWeekEnd;
    });
  });

  return (
    <div>
      <div className={classes.list}>
        <h2 className={classes.tabheader}>Performance of all assets for the current week</h2>
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
              <tr onClick={()=>router.push(`/dashboard/asserts/${assert?._id}/cashup `)} key={assert._id}>
                <td>{index + 1}</td>
                <td className={classes.color}>
                  {assert.location.find(val => val.currentLocation === true)?.locationName}
                </td>
                <td>{assert.assertId}</td>
                <td className={classes.color}>
                  {assert.cashup.reduce((total, sale) => {
                    const saleDate = new Date(sale.cashupDate);
                    if (saleDate >= currentWeekStart && saleDate <= currentWeekEnd) {
                      total += sale.companyAmount;
                    }
                    return total;
                  }, 0)}
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







