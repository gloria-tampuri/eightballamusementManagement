import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import classes from './Allyear.module.css';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Allyear = () => {
  const { data, error, isLoading } = useSWR('/api/asserts', fetcher);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyCashupData, setMonthlyCashupData] = useState([]);
  const [totalCompanyAmount, setTotalCompanyAmount] = useState(0);

  // Array of month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Extract the available years
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

  useEffect(() => {
    if (data) {
      // Create a list of cashup data by month for the selected year
      const monthlyData = Array(12).fill(0).map(() => 0);
      let totalCompany = 0;

      data.asserts.forEach((assert) => {
        assert.cashup.forEach((cash) => {
          const cashDate = new Date(cash.cashupDate);
          const year = cashDate.getFullYear();
          const month = cashDate.getMonth();
          if (year === selectedYear) {
            monthlyData[month] += cash.companyAmount;
            totalCompany += cash.companyAmount;
          }
        });
      });

      setMonthlyCashupData(monthlyData);
      setTotalCompanyAmount(totalCompany);
    }
  }, [data, selectedYear]);

  console.log('Selected Year:', selectedYear);
  console.log('Monthly Cashup Data:', monthlyCashupData);

  return (
    <div>
      <div>
        <select className={classes.select} value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {availableYears?.map((year) => (
            <option key={year} value={year}>
              {year}
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
          {monthlyCashupData.map((total, month) => (
            <tr key={month}>
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
