import React from "react";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";
import classes from "./YearList.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const YearList = () => {
  const router = useRouter();
  const { year } = router.query;
  const { data, error } = useSWR(`/api/expenditure/year/${year}`, fetcher, {
    refreshInterval: 1000,
  });

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

  const groupedDataByYear = data?.expenditure.reduce((result, expen) => {
    const date = new Date(expen.expenditureDate);
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];

    if (!result[monthName]) {
      result[monthName] = { expenditures: [], totalAmount: 0 };
    }
    result[monthName].expenditures.push(expen);
    result[monthName].totalAmount += expen.amount;

    return result;
  }, {});

  let totalYearAmount = 0;

  // Calculate total amount for the year
  if (groupedDataByYear) {
    totalYearAmount = Object.values(groupedDataByYear).reduce(
      (total, { totalAmount }) => total + totalAmount,
      0
    );
  }

  return (
    <div className={classes.yearExpen}>
      <div className={classes.back} onClick={() => router.back()}>
        <BiArrowBack />
        <p>Back</p>
      </div>{" "}
      <h1 className={classes.header}>List of Expenditure for {year}</h1>
      <p className={classes.total}>
        Total Amount for the Year: {totalYearAmount}
      </p>
      {/* Display grouped expenditure data */}
      {groupedDataByYear &&
        Object.entries(groupedDataByYear).map(
          ([monthKey, { expenditures, totalAmount }]) => (
            <div className={classes.list} key={monthKey}>
              <h3 className={classes.month}>{monthKey}</h3>
              <p className={classes.total}>
                Total Amount for {monthKey}: {totalAmount}
              </p>
              <table>
                <thead>
                  <tr>
                    <td>Date</td>
                    <td>Expenditure Type</td>
                    <td>Amount</td>
                  </tr>
                </thead>
                <tbody>
                  {expenditures.map((expen) => (
                    <tr key={expen.id}>
                      <td>{expen.expenditureDate}</td>
                      <td>{expen.expenditureType}</td>
                      <td className={classes.color}>{expen.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
    </div>
  );
};

export default YearList;
