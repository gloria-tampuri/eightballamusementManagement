import React, { useState, useEffect, useContext, useMemo } from "react";
import { useRouter } from "next/router";
import { BiArrowBack, BiPrinter, BiCalendar } from "react-icons/bi";
import useSWR from "swr";
import {
  ShowMonthContext,
  useMonthContext,
} from "../../../Context/ShowMonthContext";
import Back from "components/ui/back/back";
import classes from './Allyear.module.css';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Allyear = () => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR("/api/asserts", fetcher);
  const showMonthCtx = useContext(ShowMonthContext);
  const { handleShowMonth, handleHideMonth, showMonth } = showMonthCtx;
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } =
    useMonthContext();

  const [monthlyCashupData, setMonthlyCashupData] = useState([]);
  const [totalCompanyAmount, setTotalCompanyAmount] = useState(0);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Memoize available years calculation
  const availableYears = useMemo(() => {
    return (
      data?.asserts?.reduce((years, assert) => {
        assert?.cashup?.forEach((cash) => {
          const cashDate = new Date(cash.cashupDate);
          const year = cashDate.getFullYear();
          if (!years.includes(year)) {
            years.push(year);
          }
        });
        return years.sort((a, b) => b - a); // Sort years in descending order
      }, []) || []
    );
  }, [data]);

  // Calculate monthly data
  useEffect(() => {
    if (data) {
      const monthlyData = Array(12).fill(0);
      let totalCompany = 0;

      data.asserts.forEach((assert) => {
        assert.cashup?.forEach((cash) => {
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

  const handleRowClick = (month) => {
    setSelectedMonth(month);
    router.push(`/dashboard/${selectedYear}/${month + 1}`);
  };

  if (isLoading) {
    return (
      <div className={classes.loadingContainer}>
        <h4>Loading data...</h4>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.errorContainer}>
        <h4 className={classes.errorTitle}>Error loading data</h4>
        <p className={classes.errorText}>Please try again later</p>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      {/* Header Row */}
      <div className={classes.headerRow}>
          <Back />
        <div className={classes.printButtonContainer}>
          <button
            className={classes.printButton}
            onClick={() => window.print()}
          >
            <BiPrinter className={classes.buttonIcon} />
            Print Report
          </button>
        </div>
      </div>

      {/* Title and Year Selection Card */}
      <div className={classes.card}>
        <div className={classes.cardHeader}>
          <div className={classes.titleContainer}>
            <h4 className={classes.title}>
              <BiCalendar className={classes.titleIcon} />
              Yearly Cashup Summary
            </h4>
          </div>
          <div className={classes.selectContainer}>
            <BiCalendar className={classes.selectIcon} />
            <select
              className={classes.yearSelect}
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Total Amount Card */}
      <div className={classes.card}>
        <div className={classes.statisticContainer}>
          <h5 className={classes.statisticTitle}>
            Total Company Amount for {selectedYear}
          </h5>
          <div className={classes.statisticValue}>
            ₵{totalCompanyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={classes.tableContainer}>
        <div className={classes.tableWrapper}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.tableHeader}>Month</th>
                <th className={`${classes.tableHeader} ${classes.alignRight}`}>Total Cashup</th>
              </tr>
            </thead>
            <tbody>
              {monthlyCashupData.map((total, month) => (
                <tr
                  key={month}
                  className={classes.tableRow}
                  onClick={() => handleRowClick(month)}
                  style={{ cursor: "pointer" }}
                >
                  <td className={classes.tableCell}>
                    <strong>{monthNames[month]}</strong>
                  </td>
                  <td className={`${classes.tableCell} ${classes.alignRight} ${classes.companyShareCell}`}>
                    ₵{total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Allyear;