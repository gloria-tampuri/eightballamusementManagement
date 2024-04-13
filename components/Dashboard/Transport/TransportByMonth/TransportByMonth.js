// import React, { useState } from "react";
// import Link from "next/link";
// import useSWR from "swr";
// import { useRouter } from "next/router";
// import { BiArrowBack } from "react-icons/bi";
// import classes from "./TransportByMonth.module.css";
// import { AiOutlineDelete } from "react-icons/ai";

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

// const TransportByMonth = () => {
//   const router = useRouter();
//   const { year } = router.query;
//   const { data, error, mutate } = useSWR(
//     `/api/transport/year/${year}`,
//     fetcher,
//     { refreshInterval: 1000 }
//   );

//   const monthNames = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const [weekVisibility, setWeekVisibility] = useState({});
//   const[paid, setPaid]=useState(false)

//   const toggleWeekVisibility = (weekKey) => {
//     setWeekVisibility((prevState) => ({
//       ...prevState,
//       [weekKey]: !prevState[weekKey],
//     }));
//   };

//   const deleteHandler = async (transportId) => {
//     try {
//         const response = await fetch(`/api/transport/${transportId}`, {
//             method: "DELETE",
//         });
//         if (response.ok) {
//           mutate();
//         }else{
//           console.error('Error deleting task');
//           alert("Error deleting transport: " + error.message);
//         }
//     } catch (error) {
//         console.error("Error deleting transport:", error);
//         alert("Error deleting transport: " + error.message);
//     }
// };


//   const groupedDataByWeekAndMonth = data?.transport.reduce((result, expen) => {
//     const date = new Date(expen.transportDate);
//     const year = date.getFullYear();
//     const monthIndex = date.getMonth();
//     const monthName = monthNames[monthIndex];
//     const weekNumber = getWeekNumber(date);
//     const weekStart = getWeekStartDate(date);
//     const weekEnd = getWeekEndDate(date);

//     if (!result[monthName]) {
//       result[monthName] = {};
//     }

//     if (!result[monthName][weekNumber]) {
//       result[monthName][weekNumber] = {
//         transports: [],
//         totalAmount: 0,
//         weekStart,
//         weekEnd,
//       };
//     }

//     result[monthName][weekNumber].transports.push(expen);
//     result[monthName][weekNumber].totalAmount += expen.amount;

//     return result;
//   }, {});

//   let totalYearAmount = 0;

//   if (groupedDataByWeekAndMonth) {
//     totalYearAmount = Object.values(groupedDataByWeekAndMonth).reduce(
//       (total, weeksData) => {
//         return (
//           total +
//           Object.values(weeksData).reduce(
//             (weekTotal, { totalAmount }) => weekTotal + totalAmount,
//             0
//           )
//         );
//       },
//       0
//     );
//   }

//   const markWeekAsPaid = async (weekKey) => {
//     try {
//       const response = await fetch(`/api/transport/week/${weekKey}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ paid: true }), // Set the 'paid' field to true
//       });
//       if (response.ok) {
//         setPaidWeeks([...paidWeeks, weekKey]);
//       } else {
//         console.error("Error marking week as paid");
//         alert("Error marking week as paid");
//       }
//     } catch (error) {
//       console.error("Error marking week as paid:", error);
//       alert("Error marking week as paid: " + error.message);
//     }
//   };
  

//   return (
//     <div className={classes.yearExpen}>
//       <div className={classes.back} onClick={() => router.back()}>
//         <BiArrowBack />
//        <p>Back</p>
//       </div>
//       <h1 className={classes.header}>List of transport for {year}</h1>
//       <p className={classes.total}>
//         Total Amount for the Year: {totalYearAmount}
//       </p>

//       {groupedDataByWeekAndMonth &&
//         Object.entries(groupedDataByWeekAndMonth)
//           .sort(([monthA], [monthB]) => {
//             return monthNames.indexOf(monthB) - monthNames.indexOf(monthA);
//           })
//           .map(([monthKey, monthData]) => (
//             <div key={monthKey}>
//               <h2>{monthKey}</h2>
//               {Object.entries(monthData)
//                 .sort(([weekA], [weekB]) => weekB - weekA)
//                 .map(([weekKey, weekData]) => (
//                   <div key={weekKey}>
//                     <h3 className={classes.week}onClick={() => toggleWeekVisibility(weekKey)}>
//                       Week {weekKey} ({weekData.weekStart} - {weekData.weekEnd})
//                     </h3>
//                     {weekVisibility[weekKey] && (
//                       <div className={classes.list}>
//                         <p className={classes.total}>
//                           Total Amount for Week {weekKey}:{" "}
//                           {weekData.totalAmount}
//                         </p>
//                         <table>
//                           <thead>
//                             <tr>
//                               <td>Date</td>
//                               <td>From</td>
//                               <td>Destination</td>
//                               <td>Amount</td>
//                               <td>Paid</td>
//                               <th>Delete</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {weekData.transports.map((expen) => (
//                               <tr key={expen._id}>
//                                 <td>{expen.transportDate}</td>
//                                 <td>{expen.from}</td>
//                                 <td>{expen.destination}</td>
//                                 <td className={classes.color}>
//                                   {expen.amount}
//                                 </td>
//                                 <td>{ expen?.paid?.toString()}</td>
//                                 <td>
//                                   <AiOutlineDelete
//                                     className={classes.delete}
//                                     onClick={() => deleteHandler(expen._id)}
//                                   />
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
                      
//                         </table>
//                         <button onClick={()=>{setPaid(true)}} className={classes.button}>{paid?"Transport paid":'Pay Transport for this week'}</button>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//             </div>
//           ))}
//     </div>
//   );
// };

// // Function to get the week number of a date
// function getWeekNumber(date) {
//   const onejan = new Date(date.getFullYear(), 0, 1);
//   const weekNumber = Math.ceil(
//     ((date - onejan) / 86400000 + onejan.getDay() + 1) / 7
//   );
//   return weekNumber;
// }

// // Function to get the start date of the week
// function getWeekStartDate(date) {
//   const firstDayOfWeek = new Date(
//     date.getFullYear(),
//     date.getMonth(),
//     date.getDate() - date.getDay()
//   );
//   return firstDayOfWeek.toLocaleDateString();
// }

// // Function to get the end date of the week
// function getWeekEndDate(date) {
//   const lastDayOfWeek = new Date(
//     date.getFullYear(),
//     date.getMonth(),
//     date.getDate() + (6 - date.getDay())
//   );
//   return lastDayOfWeek.toLocaleDateString();
// }

// export default TransportByMonth;


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
  const [paidWeeks, setPaidWeeks] = useState([]);

  const toggleWeekVisibility = (weekKey) => {
    setWeekVisibility((prevState) => ({
      ...prevState,
      [weekKey]: !prevState[weekKey],
    }));
  };

  const deleteHandler = async (transportId) => {
    try {
      const response = await fetch(`/api/transport/${transportId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        mutate();
      } else {
        console.error("Error deleting task");
        alert("Error deleting transport: " + error.message);
      }
    } catch (error) {
      console.error("Error deleting transport:", error);
      alert("Error deleting transport: " + error.message);
    }
  };

  const markWeekAsPaid = async (weekKey) => {
    try {
      const transportsToUpdate = Object.values(groupedDataByWeekAndMonth)
        .map((monthData) => monthData[weekKey]?.transports)
        .filter((transports) => transports)
        .flat();
  
      for (const transport of transportsToUpdate) {
        const response = await fetch(`/api/transport/${transport._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paid: true }), // Set the 'paid' field to true
        });
  
        if (!response.ok) {
          console.error("Error marking transport as paid:", response.statusText);
          alert("Error marking transport as paid");
        }
      }
  
      setPaidWeeks([...paidWeeks, weekKey]);
    } catch (error) {
      console.error("Error marking week as paid:", error);
      alert("Error marking week as paid: " + error.message);
    }
  };
  
  

  const renderWeekData = (weekData, weekKey) => {
    return (
      <div className={`${classes.list} ${isWeekPaid(weekKey) ? classes.green : ""}`}>
        <p className={`${classes.table} ${isWeekPaid(weekKey) ? classes.green : ""}`}>
          Total Amount for Week {weekKey}: {weekData.totalAmount}
        </p>
        <table>
          <thead>
            <tr>
              <td>Date</td>
              <td>From</td>
              <td>Destination</td>
              <td>Amount</td>
              <td>Paid</td>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {weekData.transports.map((expen) => (
              <tr key={expen._id}>
                <td>{expen.transportDate}</td>
                <td>{expen.from}</td>
                <td>{expen.destination}</td>
                <td className={`${classes.color} ${isWeekPaid(weekKey) ? classes.green : ""}`}>
                  {expen.amount}
                </td>
                <td>{expen?.paid?.toString()}</td>
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
        <button
          onClick={() => markWeekAsPaid(weekKey)}
          className={`${classes.button} ${
            isWeekPaid(weekKey) ? classes.greenButton : ""
          }`}
          disabled={isWeekPaid(weekKey)}
        >
          {isWeekPaid(weekKey) ? "Transport paid" : "Pay Transport for this week"}
        </button>
      </div>
    );
  };

  const isWeekPaid = (weekKey) => {
    return paidWeeks.includes(weekKey);
  };

  if (!data) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const groupedDataByWeekAndMonth = data.transport.reduce((result, expen) => {
    const date = new Date(expen.transportDate);
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const weekNumber = getWeekNumber(date);
    const weekStart = getWeekStartDate(date);
    const weekEnd = getWeekEndDate(date);

    result[monthName] = result[monthName] || {};
    result[monthName][weekNumber] = result[monthName][weekNumber] || {
      transports: [],
      totalAmount: 0,
      weekStart,
      weekEnd,
    };

    result[monthName][weekNumber].transports.push(expen);
    result[monthName][weekNumber].totalAmount += expen.amount;

    return result;
  }, {});

  return (
    <div className={classes.yearExpen}>
      <div className={classes.back} onClick={() => router.back()}>
        <BiArrowBack />
        <p>Back</p>
      </div>
      <h1 className={classes.header}>List of transport for {year}</h1>
      {Object.entries(groupedDataByWeekAndMonth).map(([monthKey, monthData]) => (
        <div key={monthKey}>
          <h2>{monthKey}</h2>
          {Object.entries(monthData).map(([weekKey, weekData]) => (
            <div key={weekKey}>
              <h3
                className={classes.week}
                onClick={() => toggleWeekVisibility(weekKey)}
              >
                Week {weekKey} ({weekData.weekStart} - {weekData.weekEnd})
              </h3>
              {weekVisibility[weekKey] && renderWeekData(weekData, weekKey)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

function getWeekNumber(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((date - onejan) / 86400000 + onejan.getDay() + 1) / 7
  );
  return weekNumber;
}

function getWeekStartDate(date) {
  const firstDayOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - date.getDay()
  );
  return firstDayOfWeek.toLocaleDateString();
}

function getWeekEndDate(date) {
  const lastDayOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + (6 - date.getDay())
  );
  return lastDayOfWeek.toLocaleDateString();
}

export default TransportByMonth;
