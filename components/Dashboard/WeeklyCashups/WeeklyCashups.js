import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import classes from './WeeklyCashups.module.css';
import { useRouter } from 'next/router';
import { getSignedInEmail } from '../../../auth';
import OperatorWeeklyCashups from '../OperatorWeeklyCashups/OperatorWeeklyCashups';
import AdminWeeklyCashup from '../OperatorWeeklyCashups/AdminWeekely';

const fetcher = (...args) => fetch(...args).then(res => res.json());

const WeeklyCashups = () => {
  const { data, error } = useSWR('/api/asserts', fetcher);
  const router = useRouter();
  const [admin, setAdmin] = useState(false);

  const currentDate = new Date();
  const currentWeekStart = new Date(currentDate);
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
  currentWeekStart.setHours(0, 0, 0, 0);

  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const previousWeekEnd = new Date(previousWeekStart);
  previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);

  let currentWeekTotalSum = 0;
  let previousWeekTotalSum = 0;

  const currentWeekData = data?.asserts.map((assert) => {
    const totalAmount = assert.cashup.reduce((total, sale) => {
      const saleDate = new Date(sale.cashupDate);
      if (saleDate >= currentWeekStart && saleDate <= currentWeekEnd) {
        total += sale.cashReceived;
      }
      return total;
    }, 0);
    currentWeekTotalSum += totalAmount;
    return { ...assert, totalAmount };
  });

  const previousWeekData = data?.asserts.map((assert) => {
    const totalAmount = assert.cashup.reduce((total, sale) => {
      const saleDate = new Date(sale.cashupDate);
      if (saleDate >= previousWeekStart && saleDate <= previousWeekEnd) {
        total += sale.cashReceived;
      }
      return total;
    }, 0);
    previousWeekTotalSum += totalAmount;
    return { ...assert, totalAmount };
  });

  currentWeekData?.sort((a, b) => b.totalAmount - a.totalAmount);
  previousWeekData?.sort((a, b) => b.totalAmount - a.totalAmount);

  useEffect(() => {
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

  return (
    <div>
      {admin ? (
        <div className={classes.list}>
          <button className="printButton" onClick={() => window.print()}>
            Print
          </button>
         
          <h2 className={classes.tabheader}>
            Performance of all assets for the current week. Total Amount:{' '}
            {currentWeekTotalSum}
          </h2>

           <div className={classes.tableContainer}>
        <div className={classes.tableWrapper}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.tableHeader}>Position</th>
                <th className={classes.tableHeader}>Location</th>
                {/* <th className={classes.tableHeader}>AssetID</th> */}
                <th className={`${classes.tableHeader} ${classes.alignRight}`}>Cashup Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentWeekData?.map((assert, index) => (
                <tr 
                  className={classes.tableRow} 
                  onClick={() => router.push(`/dashboard/asserts/${assert?._id}/cashup`)} 
                  key={assert?._id}
                  style={{ cursor: 'pointer' }}
                >
                  <td className={`${classes.tableCell} ${classes.numberCell}`}>{index + 1}</td>
                  <td className={classes.tableCell}>
                    {assert?.location.find(val => val?.currentLocation === true)?.locationName}
                  </td>
                  {/* <td className={classes.tableCell}>{assert?.assertId}</td> */}
                  <td className={`${classes.tableCell} ${classes.alignRight} ${classes.numberCell} ${classes.companyShareCell}`}>
                    {assert?.totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
          


          <AdminWeeklyCashup />
          <OperatorWeeklyCashups />
        </div>
      ) : (
        <OperatorWeeklyCashups />
      )}
    </div>
  );
};

export default WeeklyCashups;

