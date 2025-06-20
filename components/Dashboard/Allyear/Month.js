import React, { useContext, useMemo } from "react";
import { BiArrowBack, BiPrinter } from "react-icons/bi";
import useSWR from "swr";
import { ShowMonthContext } from "../../../Context/ShowMonthContext";
import { useRouter } from "next/router";
import Back from "components/ui/back/back";
import classes from './Month.module.css';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Month = () => {
  const { data, error, isLoading } = useSWR("/api/asserts", fetcher);
  const showMonthCtx = useContext(ShowMonthContext);
  const { handleShowMonth, handleHideMonth, showMonth } = showMonthCtx;
  const router = useRouter();
  const year = parseInt(router.query.year);
  const month = parseInt(router.query.month) - 1;

  // Memoized calculation of asset data with totals
  const assetData = useMemo(() => {
    if (!data?.asserts) return [];

    return data.asserts.map((assert) => {
      const totalCashup =
        assert.cashup?.reduce((sum, sale) => {
          const saleDate = new Date(sale.cashupDate);
          const saleYear = saleDate.getFullYear();
          const saleMonth = saleDate.getMonth();

          if (saleYear === year && saleMonth === month) {
            return sum + sale.cashReceived;
          }
          return sum;
        }, 0) || 0;

      const currentLocation =
        assert.location?.find((loc) => loc.currentLocation)?.locationName ||
        "N/A";

      return {
        ...assert,
        totalCashup,
        currentLocation,
        isLowPerformance: totalCashup < 1200,
      };
    });
  }, [data, year, month]);

  // Sort by total cashup descending
  const sortedData = useMemo(() => {
    return [...assetData].sort((a, b) => b.totalCashup - a.totalCashup);
  }, [assetData]);

  const totalRevenue = useMemo(() => {
    return sortedData.reduce((sum, asset) => sum + asset.totalCashup, 0);
  }, [sortedData]);

  if (isLoading) {
    return (
      <div className={classes.loadingContainer}>
        <h4>Loading monthly data...</h4>
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

      {/* Title Card */}
      <div className={classes.card}>
        <h3 className={classes.monthTitle}>
          Monthly Performance:{" "}
          {new Date(year, month).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
      </div>

      {/* Total Revenue Card */}
      <div className={classes.card}>
        <div className={classes.statisticContainer}>
          <h5 className={classes.statisticTitle}>Total Revenue</h5>
          <div className={classes.statisticValue}>
            ₵{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={classes.tableContainer}>
        <div className={classes.tableWrapper}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th className={classes.tableHeader}>Position</th>
                <th className={classes.tableHeader}>Location</th>
                <th className={classes.tableHeader}>Asset ID</th>
                <th className={`${classes.tableHeader} ${classes.alignRight}`}>Cashup Amount</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((asset, index) => (
                <tr
                  key={asset._id}
                  className={`${classes.tableRow} ${asset.isLowPerformance ? classes.warningRow : ''}`}
                  onClick={() => router.push(`/dashboard/asserts/${asset._id}/cashup`)}
                  style={{ cursor: "pointer" }}
                >
                  <td className={`${classes.tableCell} ${classes.numberCell}`}>
                    {index + 1}
                  </td>
                  <td className={classes.tableCell}>
                    <strong>{asset.currentLocation}</strong>
                  </td>
                  <td className={classes.tableCell}>
                    {asset.assertId}
                  </td>
                  <td className={`${classes.tableCell} ${classes.alignRight}`}>
                    <span className={`${classes.tag} ${asset.isLowPerformance ? classes.tagRed : classes.tagGreen}`}>
                      ₵{asset.totalCashup.toLocaleString()}
                    </span>
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

export default Month;