import React, { useState, useEffect, useContext } from 'react';
import useSWR from 'swr';
import classes from './Allyear.module.css';
import { useRouter } from 'next/router'; // Import the useRouter
import { ShowMonthContext, useMonthContext } from '../../../Context/ShowMonthContext';
import { BiArrowBack } from 'react-icons/bi';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Allyear = () => {
  const { data, error, isLoading } = useSWR('/api/asserts', fetcher);
  const showMonthCtx = useContext(ShowMonthContext);
  const { handleShowMonth, handleHideMonth, showMonth } = showMonthCtx;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useMonthContext();

  // const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyCashupData, setMonthlyCashupData] = useState([]);
  const [totalCompanyAmount, setTotalCompanyAmount] = useState(0);
  // const [selectedMonth, setSelectedMonth] = useState(0); // Initialize with a default value

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const availableYears = data?.asserts.reduce((years, assert) => {
    assert.cashup.forEach((cash) => {
      const cashDate = new Date(cash.cashupDate);
      const year = cashDate.getFullYear();
      if (!years.includes(year)) {
        years.push(year);
        
      }
    });
    return years;
  }, []);

  const router = useRouter(); // Get the router

  const handleRowClick = (month) => {
    const year = selectedYear;
    setSelectedMonth(month);
    // Navigate to the monthly page with year and month as route parameters
    router.push(`/dashboard/${year}/${month + 1}`);
  };

  // const handleRowClick = (month) => {
  //   const year = selectedYear;
  //   setSelectedMonth(month);
  //   handleShowMonth(month, year);
  // };

  useEffect(() => {
    if (data) {
      const monthlyData = Array(12).fill(0).map(() => 0);
      let totalCompany = 0;

      data.asserts.forEach((assert) => {
        assert.cashup.forEach((cash) => {
          const cashDate = new Date(cash.cashupDate);
          const year = cashDate.getFullYear();
          const month = cashDate.getMonth();
          if (year === selectedYear) {
            monthlyData[month] += cash.cashReceived;
            totalCompany += cash.cashReceived;
          }
        });
      });

      setMonthlyCashupData(monthlyData);
      setTotalCompanyAmount(totalCompany);
    }
  }, [data, selectedYear]);

 

  return (
    <div>
      <div className={classes.backPrint}><div className={classes.back} onClick={() => router.back()}>       <BiArrowBack />Back</div>
      <button className='printButton' onClick={() => window.print()}>Print</button></div>
      <div>
        <select className={classes.select} value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {availableYears?.map((year) => (
            <option key={year} value={year}>
              {year && year}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.totalCompanyAmount}>
        Total Company Amount for {selectedYear}: {totalCompanyAmount}
      </div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Cashup</th>
          </tr>
        </thead>
        <tbody>
          {monthlyCashupData?.map((total, month) => (
            <tr key={month} onClick={() => handleRowClick(month)}>
              <td>{monthNames[month]}</td>
              <td>{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Allyear;
