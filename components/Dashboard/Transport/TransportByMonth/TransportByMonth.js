import React, { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";
import classes from "./TransportByMonth.module.css";
import { AiOutlineDelete } from "react-icons/ai";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const TransportByMonth = () => {
  const router = useRouter();
  const { year } = router.query;
  const { data, error, mutate } = useSWR(
    `/api/transport/year/${year}`,
    fetcher,
    { refreshInterval: 1000 }
  );

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

  const [weekVisibility, setWeekVisibility] = useState({});

  const toggleWeekVisibility = (weekKey) => {
    setWeekVisibility((prevState) => ({
      ...prevState,
      [weekKey]: !prevState[weekKey],
    }));
  };

  const deleteHandler = async (transportId) => {
    console.log("clicked");
    try {
      const response = await fetch(`/api/transport/${transportId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete transport");
      }
      mutate();
    } catch (error) {
      console.error("Error deleting transport:", error);
      alert("Error deleting transport: " + error.message);
    }
  };

  // Grouping data by week and then by month
  const groupedDataByWeekAndMonth = data?.transport.reduce((result, expen) => {
    const date = new Date(expen.transportDate);
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const weekNumber = getWeekNumber(date);
    const weekStart = getWeekStartDate(date);
    const weekEnd = getWeekEndDate(date);

    if (!result[monthName]) {
      result[monthName] = {};
    }

    if (!result[monthName][weekNumber]) {
      result[monthName][weekNumber] = {
        transports: [],
        totalAmount: 0,
        weekStart,
        weekEnd,
      };
    }

    result[monthName][weekNumber].transports.push(expen);
    result[monthName][weekNumber].totalAmount += expen.amount;

    return result;
  }, {});

  let totalYearAmount = 0;

  // Calculate total amount for the year
  if (groupedDataByWeekAndMonth) {
    totalYearAmount = Object.values(groupedDataByWeekAndMonth).reduce(
      (total, weeksData) => {
        return (
          total +
          Object.values(weeksData).reduce(
            (weekTotal, { totalAmount }) => weekTotal + totalAmount,
            0
          )
        );
      },
      0
    );
  }

  return (
    <div className={classes.yearExpen}>
      <div className={classes.back} onClick={() => router.back()}>
        <BiArrowBack />
       <p>Back</p>
      </div>
      <h1 className={classes.header}>List of transport for {year}</h1>
      <p className={classes.total}>
        Total Amount for the Year: {totalYearAmount}
      </p>

      {/* Display grouped transport data */}
      {groupedDataByWeekAndMonth &&
        Object.entries(groupedDataByWeekAndMonth)
          .sort(([monthA], [monthB]) => {
            return monthNames.indexOf(monthB) - monthNames.indexOf(monthA);
          })
          .map(([monthKey, monthData]) => (
            <div key={monthKey}>
              <h2>{monthKey}</h2>
              {Object.entries(monthData)
                .sort(([weekA], [weekB]) => weekB - weekA)
                .map(([weekKey, weekData]) => (
                  <div key={weekKey}>
                    <h3 onClick={() => toggleWeekVisibility(weekKey)}>
                      Week {weekKey} ({weekData.weekStart} - {weekData.weekEnd})
                    </h3>
                    {weekVisibility[weekKey] && (
                      <div className={classes.list}>
                        <p className={classes.total}>
                          Total Amount for Week {weekKey}:{" "}
                          {weekData.totalAmount}
                        </p>
                        <table>
                          <thead>
                            <tr>
                              <td>Date</td>
                              <td>From</td>
                              <td>Destination</td>
                              <td>Amount</td>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {weekData.transports.map((expen) => (
                              <tr key={expen._id}>
                                <td>{expen.transportDate}</td>
                                <td>{expen.from}</td>
                                <td>{expen.destination}</td>
                                <td className={classes.color}>
                                  {expen.amount}
                                </td>
                                <td>
                                  <AiOutlineDelete
                                    className={classes.delete}
                                    onClick={() => deleteHandler(expen._id)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
    </div>
  );
};

// Function to get the week number of a date
function getWeekNumber(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((date - onejan) / 86400000 + onejan.getDay() + 1) / 7
  );
  return weekNumber;
}

// Function to get the start date of the week
function getWeekStartDate(date) {
  const firstDayOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay()
  );
  return firstDayOfWeek.toLocaleDateString();
}

// Function to get the end date of the week
function getWeekEndDate(date) {
  const lastDayOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + (6 - date.getDay())
  );
  return lastDayOfWeek.toLocaleDateString();
}

export default TransportByMonth;
