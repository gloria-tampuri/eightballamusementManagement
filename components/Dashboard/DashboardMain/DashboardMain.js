import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getSignedInEmail } from "../../../auth";
import OperatorDashboard from "../OperatordashBoard/OperatorDashboard";
import "react-toastify/dist/ReactToastify.css";
import classes from "./DashboardMain.module.css";
import { Card, Table, Typography, Spin, Alert, Tag } from "antd";

const { Title, Text } = Typography;

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

const DashboardMain = () => {
  const { data, error, isLoading } = useSWR("/api/asserts", fetcher);
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
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

  if (isLoading) return <Spin size="large" className={classes.spinner} />;
  if (error) return <Alert message="Error loading data" type="error" />;
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

  // Table columns configuration
  const performanceColumns = [
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (locations) => {
        const currentLocation = locations.find((loc) => loc?.currentLocation);
        return currentLocation?.locationName || "N/A";
      },
      ellipsis: true,
    },
    {
      title: "Asset ID",
      dataIndex: "assertId",
      key: "assertId",
    },
    {
      title: "Cashup Amount",
      dataIndex: "totalSalesCurrentMonth",
      key: "amount",
      render: (amount) => (
        <Tag color={amount < 1200 ? "red" : amount < 2000 ? "orange" : "green"}>
          {amount}
        </Tag>
      ),
    },
  ];

  return (
    <div className={classes.dashboardContainer}>
      <Title level={2} className={classes.dashboardTitle}>
        Dashboard Overview
      </Title>

      {/* Highlights Section */}
      <div className={classes.highlights}>
        {highlightCards.map((card, index) => {
          const content = (
            <Card
              className={`${classes.box} ${card.className}`}
              hoverable
              key={index}
            >
              <Title level={3} className={classes.cardValue}>
                {card.value}
              </Title>
              <Text className={classes.cardTitle}>{card.title}</Text>
            </Card>
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
        <Title level={4} className={classes.sectionTitle}>
          Asset Performance for {currentMonthName}
        </Title>

        <Table
          columns={performanceColumns}
          dataSource={dashboardData?.monthlyPerformance}
          rowKey="_id"
          onRow={(record) => ({
            onClick: () =>
              router.push(`/dashboard/asserts/${record._id}/cashup`),
            className: classes.tableRow,
          })}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          loading={isLoading}
          className={classes.performanceTable}
        />
      </div>
    </div>
  );
};

export default DashboardMain;
