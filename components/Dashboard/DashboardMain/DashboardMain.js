import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getSignedInEmail } from "../../../auth";
import OperatorDashboard from "../OperatordashBoard/OperatorDashboard";
import "react-toastify/dist/ReactToastify.css";
import classes from "./DashboardMain.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

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

// Custom Spinner Component
const CustomSpinner = ({ className }) => (
  <div className={`${classes.spinnerContainer} ${className}`}>
    <div className={classes.spinner}></div>
    <p>Loading...</p>
  </div>
);

// Custom Alert Component
const CustomAlert = ({ message, type }) => (
  <div className={`${classes.alert} ${classes[`alert${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
    {message}
  </div>
);

// Custom Card Component
const CustomCard = ({ children, className, hoverable, onClick }) => (
  <div 
    className={`${classes.card} ${className} ${hoverable ? classes.cardHoverable : ''}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// Custom Tag Component
const CustomTag = ({ color, children }) => (
  <span className={`${classes.tag} ${classes[`tag${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
    {children}
  </span>
);

const DashboardMain = () => {
  const { data, error, isLoading } = useSWR("/api/asserts", fetcher);
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const currentDate = new Date();
  const currentMonthName = monthNames[currentDate.getMonth()];

  // Memoized calculations to avoid redundant computations
  const dashboardData = useMemo(() => {
    if (!data?.asserts) return null;

    const allAssets = data.asserts;
    const totalAssets = allAssets.length;

    // Calculate yearly and monthly sales
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let totalSalesYear = 0;
    let totalSalesMonth = 0;
    let weeklyTotal = 0;

    // Calculate current week dates
    const currentWeekStart = new Date(currentDate);
    currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);

    // Process all assets data
    const processedAssets = allAssets.map((asset) => {
      let assetYearlySales = 0;
      let assetMonthlySales = 0;
      let assetWeeklySales = 0;

      asset.cashup?.forEach((sale) => {
        const saleDate = new Date(sale.cashupDate);
        const saleYear = saleDate.getFullYear();
        const saleMonth = saleDate.getMonth() + 1;

        // Yearly calculation
        if (saleYear === currentYear) {
          assetYearlySales += sale.cashReceived;
          totalSalesYear += sale.cashReceived;
        }

        // Monthly calculation
        if (saleMonth === currentMonth && saleYear === currentYear) {
          assetMonthlySales += sale.cashReceived;
          totalSalesMonth += sale.cashReceived;
        }

        // Weekly calculation
        if (saleDate >= currentWeekStart && saleDate <= currentWeekEnd) {
          assetWeeklySales += sale.cashReceived;
          weeklyTotal += sale.cashReceived;
        }
      });

      return {
        ...asset,
        totalSalesCurrentMonth: assetMonthlySales,
        weeklySales: assetWeeklySales,
      };
    });

    // Sort by monthly performance
    const sortedByMonthlyPerformance = [...processedAssets].sort(
      (a, b) => b.totalSalesCurrentMonth - a.totalSalesCurrentMonth
    );

    return {
      totalAssets,
      totalSalesYear,
      totalSalesMonth,
      weeklyTotal,
      monthlyPerformance: sortedByMonthlyPerformance,
    };
  }, [data]);

  // Pagination calculations
  const paginatedData = useMemo(() => {
    if (!dashboardData?.monthlyPerformance) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return dashboardData.monthlyPerformance.slice(startIndex, endIndex);
  }, [dashboardData, currentPage]);

  const totalPages = Math.ceil((dashboardData?.monthlyPerformance?.length || 0) / pageSize);

  // Check admin status
  useEffect(() => {
    getSignedInEmail()
      .then((email) => {
        if (email === "richard.ababio@eightball.com") {
          setAdmin(true);
        }
      })
      .catch(console.error);
  }, []);

  if (isLoading) return <CustomSpinner className={classes.spinner} />;
  if (error) return <CustomAlert message="Error loading data" type="error" />;
  if (!admin) return <OperatorDashboard />;

  // Card data for the highlights section
  const highlightCards = [
    {
      title: "Total Assets",
      value: dashboardData?.totalAssets || 0,
      link: "/dashboard/asserts",
      className: classes.first,
    },
    {
      title: "Yearly CashUp",
      value: dashboardData?.totalSalesYear || 0,
      link: "/dashboard/allyear",
      className: classes.second,
    },
    {
      title: "Monthly CashUp",
      value: dashboardData?.totalSalesMonth || 0,
      className: classes.third,
    },
    {
      title: "Weekly CashUp",
      value: dashboardData?.weeklyTotal || 0,
      link: "/dashboard/weeklycashups",
      className: classes.fourth,
    },
  ];

  const handleRowClick = (record) => {
    router.push(`/dashboard/asserts/${record._id}/cashup`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={classes.dashboardContainer}>
      <h2 className={classes.dashboardTitle}>
        Dashboard Overview
      </h2>

      {/* Highlights Section */}
      <div className={classes.highlights}>
        {highlightCards.map((card, index) => {
          const content = (
            <CustomCard
              className={`${classes.box} ${card.className}`}
              hoverable
              key={index}
            >
              <h3 className={classes.cardValue}>
                {card.value}
              </h3>
              <p className={classes.cardTitle}>{card.title}</p>
            </CustomCard>
          );

          return card.link ? (
            <Link href={card.link} key={index}>
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </div>

      {/* Performance Table Section */}
      <div className={classes.performanceSection}>
        <h4 className={classes.sectionTitle}>
          Asset Performance for {currentMonthName}
        </h4>

        {/* Custom Table */}
        <div className={classes.tableContainer}>
          <table className={classes.performanceTable}>
            <thead className={classes.tableHead}>
              <tr>
                <th className={classes.tableHeader}>Position</th>
                <th className={classes.tableHeader}>Location</th>
                <th className={classes.tableHeader}>Asset ID</th>
                <th className={classes.tableHeader}>Cashup Amount</th>
              </tr>
            </thead>
            <tbody className={classes.tableBody}>
              {paginatedData.length > 0 ? (
                paginatedData.map((record, index) => {
                  const currentLocation = record.location?.find((loc) => loc?.currentLocation);
                  const globalIndex = (currentPage - 1) * pageSize + index + 1;
                  
                  return (
                    <tr 
                      key={record._id} 
                      className={classes.tableRow}
                      onClick={() => handleRowClick(record)}
                    >
                      <td className={classes.tableCell}>{globalIndex}</td>
                      <td className={classes.tableCell}>
                        {currentLocation?.locationName || "N/A"}
                      </td>
                      <td className={classes.tableCell}>{record.assertId}</td>
                      <td className={classes.tableCell}>
                        <CustomTag 
                          color={
                            record.totalSalesCurrentMonth < 1200 
                              ? "red" 
                              : record.totalSalesCurrentMonth < 2000 
                              ? "orange" 
                              : "green"
                          }
                        >
                          {record.totalSalesCurrentMonth}
                        </CustomTag>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className={classes.emptyState}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Custom Pagination */}
        {totalPages > 1 && (
          <div className={classes.pagination}>
            <button 
              className={classes.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <div className={classes.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${classes.pageNumber} ${page === currentPage ? classes.activePage : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              className={classes.paginationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMain;