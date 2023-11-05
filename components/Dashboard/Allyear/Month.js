import React, { useContext } from 'react';
import Modal from '../Modal/Modal';
import useSWR from 'swr';
import classes from './Month.module.css';
import { AiOutlineClose } from 'react-icons/ai';
import { ShowMonthContext } from '../../../Context/ShowMonthContext';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Month = () => {
  const { data, error, isLoading } = useSWR('/api/asserts', fetcher);
  const showMonthCtx = useContext(ShowMonthContext);
  const { handleShowMonth, handleHideMonth, showMonth } = showMonthCtx;
  const allAssets = data?.asserts;
  const router = useRouter();
  const year = parseInt(router.query.year); // Parse to an integer
  const month = parseInt(router.query.month) - 1; 
  // Function to calculate the total cashup for an asset in the selected year and month
  const calculateTotalCashup = (assert) => {
    let totalSales = 0;

    // Check if allAssets is an array before trying to iterate over it
    if (Array.isArray(allAssets)) {
      assert.cashup.forEach((sale) => {
        const saleDate = new Date(sale.cashupDate);
        const saleYear = saleDate.getFullYear();
        const saleMonth = saleDate.getMonth() ;

        if (saleYear === year && saleMonth === month) {
          totalSales += sale.companyAmount;
        }
      });
    }

    return totalSales;
  };

  // Sort the data based on the total cashup in the selected year and month
  const sortedData = Array.isArray(allAssets)
    ? [...allAssets].sort((a, b) => calculateTotalCashup(b) - calculateTotalCashup(a))
    : [];

  return (
    <div>
     <div className={classes.back} onClick={() => router.back()}>       <BiArrowBack />Back</div>
      <p>Year: {year}</p>
      <p>Month: {month + 1}</p>

      <table className={classes.table}>
        <thead>
          <tr>
            <th>Position</th>
            <th>Location</th>
            <th>AssetID</th>
            <th>Cashup Amount</th>
          </tr>
        </thead>

        <tbody>
          {sortedData.map((assert, index) => (
            <tr onClick={()=>router.push(`/dashboard/asserts/${assert?._id}/cashup `)} key={assert._id}>
              <td>{index + 1}</td>
              <td className={classes.color}>
                {assert.location.find((val) => val.currentLocation === true)?.locationName}
              </td>
              <td>{assert.assertId}</td>
              <td className={classes.color}>{calculateTotalCashup(assert)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Month;
