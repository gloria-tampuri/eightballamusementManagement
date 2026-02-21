import React, { useState } from "react";
import Link from "next/link";
import classes from "./OperatorDashboard.module.css";
import { useAssetData } from "../../../Context/AssetDataContext";
import { useRouter } from "next/router";

const OperatorDashboard = () => {
  const router = useRouter();
  const { assetsData } = useAssetData();
  const itemsPerPage = 10; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssets = assetsData?.asserts?.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(
    (assetsData?.asserts?.length || 0) / itemsPerPage,
  );

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Helper function to calculate days ago
  const getDaysAgo = (asset) => {
    if (!asset?.cashup || asset.cashup.length === 0) return "Never";
    const dates = asset.cashup.map((c) => new Date(c.cashupDate));
    const lastCashupDate = new Date(Math.max(...dates));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cashupDate = new Date(lastCashupDate);
    cashupDate.setHours(0, 0, 0, 0);
    const timeDiff = today - cashupDate;
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "1 day ago";
    return `${daysAgo} days ago`;
  };

  return (
    <div className={classes.operator}>
      <h1>Operator dashboard</h1>
      {currentAssets?.map((asset) => (
        <div
          className={classes.asset}
          key={asset?._id}
          onClick={() =>
            router.push(`/dashboard/asserts/${asset?._id}/cashup `)
          }
        >
          <div>{asset?.assertId}</div>
          <p>
            {
              asset?.location.find((val) => val?.currentLocation === true)
                ?.locationName
            }
          </p>
          <p style={{ fontSize: "0.85em", color: "#666", marginTop: "4px" }}>
            Last Cashup: {getDaysAgo(asset)}
          </p>
        </div>
      ))}
      <div className={classes.pagination}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <span
            key={index + 1}
            onClick={() => handleClick(index + 1)}
            className={currentPage === index + 1 ? classes.active : ""}
          >
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default OperatorDashboard;
