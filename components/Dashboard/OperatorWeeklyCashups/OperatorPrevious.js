import React, { useState, useEffect } from "react";
import { getSignedInEmail } from "../../../auth";
import { set } from "date-fns";
import classes from "./OperatorWeeklyCashups.module.css";
import { useAssetData } from "../../../Context/AssetDataContext";
import { useRouter } from "next/router";
import CashUp from "../CashUp/CashUp";
import { format, startOfWeek, endOfWeek } from "date-fns";

const OperatorPrevious = ({ filterEmail, operatorNameProp }) => {
  const router = useRouter();

  const [operatorName, setOperatorName] = useState(operatorNameProp || "");
  const [operatorEmail, setOperatorEmail] = useState(filterEmail || "");
  const { assetsData } = useAssetData();

  useEffect(() => {
    if (filterEmail && operatorNameProp) {
      setOperatorEmail(filterEmail);
      setOperatorName(operatorNameProp);
    } else {
      getSignedInEmail()
        .then((email) => {
          setOperatorEmail(email);
          if (email === "samuel.bempong@eightball.com") {
            setOperatorName("Samuel Bempong");
          } else if (email === "gideon.ababio@eightball.com") {
            setOperatorName("Gideon Ababio");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [filterEmail, operatorNameProp]);
  const currentDate = new Date(); // Current date and time
  const currentWeekStart = new Date(currentDate); // Start of the current week
  currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the most recent Sunday
  currentWeekStart.setHours(0, 0, 0, 0); // Set to midnight

  const currentWeekEnd = new Date(currentWeekStart); // End of the current week
  currentWeekEnd.setDate(currentWeekEnd.getDate() + 6); // Add 7 days for a week
  currentWeekEnd.setHours(23, 59, 59, 999);

  const startOfCurrentWeek = startOfWeek(new Date());
  const endOfCurrentWeek = endOfWeek(new Date());

  const getAllWithOperator = assetsData?.asserts?.reduce((result, asset) => {
    // Check if 'cashup' is an array and has entries with 'enteredBy' equal to the operator email
    const cashupsWithOperator = asset?.cashup?.filter(
      (cashup) => cashup?.enteredBy === operatorEmail,
    );

    if (cashupsWithOperator && cashupsWithOperator.length > 0) {
      // If there are matching entries, add them to the result
      result.push({ ...asset, cashup: cashupsWithOperator });
    }

    return result;
  }, []);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const previousWeekEnd = new Date(previousWeekStart);
  previousWeekEnd.setDate(previousWeekEnd.getDate() + 6);

  let totalSum = 0;
  let previousWeekTotalSum = 0;

  const currentOperatorCashupData = getAllWithOperator?.map((assert) => {
    const totalAmount = assert.cashup.reduce((total, sale) => {
      const saleDate = new Date(sale.cashupDate);
      if (saleDate >= startOfCurrentWeek && saleDate <= endOfCurrentWeek) {
        total += sale.cashReceived;
      }
      return total;
    }, 0);
    totalSum += totalAmount;
    return { ...assert, totalAmount };
  });

  const previousWeekData = getAllWithOperator?.map((assert) => {
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
  currentOperatorCashupData?.sort((a, b) => b.totalAmount - a.totalAmount);
  previousWeekData?.sort((a, b) => b.totalAmount - a.totalAmount);

  return (
    <div className={classes.operator}>
      <h2 className={classes.tabheader}>
        Cash up entered by Operator {operatorName} for the previous week. Total
        Amount: {previousWeekTotalSum}
      </h2>

      <div className={classes.tableContainer}>
        <div className={classes.tableWrapper}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.tableHeader}>Position</th>
                <th className={classes.tableHeader}>Location</th>
                {/* <th className={classes.tableHeader}>AssetID</th> */}
                <th className={`${classes.tableHeader} ${classes.alignRight}`}>
                  Cashup Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {previousWeekData?.map((assert, index) => (
                <tr
                  className={classes.tableRow}
                  onClick={() =>
                    router.push(`/dashboard/asserts/${assert?._id}/cashup`)
                  }
                  key={assert?._id}
                  style={{ cursor: "pointer" }}
                >
                  <td className={`${classes.tableCell} ${classes.numberCell}`}>
                    {index + 1}
                  </td>
                  <td className={classes.tableCell}>
                    {
                      assert?.location.find(
                        (val) => val?.currentLocation === true,
                      )?.locationName
                    }
                  </td>
                  {/* <td className={classes.tableCell}>{assert?.assertId}</td> */}
                  <td
                    className={`${classes.tableCell} ${classes.alignRight} ${classes.numberCell} ${classes.companyShareCell}`}
                  >
                    {assert?.totalAmount}
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

export default OperatorPrevious;
