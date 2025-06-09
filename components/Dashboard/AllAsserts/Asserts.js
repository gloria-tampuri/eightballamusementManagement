import React, { useMemo, useState } from "react";
import classes from "./Asserts.module.css";
import Link from "next/link";
import useSWR from "swr";
import { Table } from 'antd';
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import { IoMdEye } from "react-icons/io";
import AddAssertForm from "../AddAssertForm/AddAssertForm";
import Back from "../../ui/back/back.js";
import Spinner from "../../ui/spinner/spinner.js";

const PAGE_SIZE = 10;
const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Asserts = () => {
  const { data, error, isLoading } = useSWR("/api/asserts", fetcher);
  const [currentPage, setCurrentPage] = useState(1);

  // Prepare and sort data
  const sortedData = useMemo(() => {
    if (!data?.asserts) return [];
    return data.asserts.slice().sort((a, b) => b.timestamp - a.timestamp);
  }, [data]);

  // Calculate pagination values
  const totalItems = sortedData.length;
  const startItem = (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalItems);
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  // Get current page data
  const currentPageData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );
  }, [sortedData, currentPage]);

  // Column definitions for Ant Design Table
  const columns = [
    {
      title: "Asset ID",
      dataIndex: "assertId",
      key: "assertId",
      render: (text) => <div className={classes.assetId}>{text}</div>,
    },
    {
      title: "Current Location",
      key: "location",
      render: (_, record) => {
        const currentLocation = record.location?.find(
          (loc) => loc.currentLocation === true
        );
        return (
          <div className={classes.location}>
            {currentLocation ? currentLocation.locationName : "N/A"}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className={classes.actions}>
          <Link
            className={classes.actions}
            href={`/dashboard/asserts/${record._id}`}
          >
            <IoMdEye />
          </Link>
        </div>
      ),
    },
  ];

  // Handle loading and error states
  if (isLoading) {
    return <Spinner overlay size="large" color="white" text="Loading assets..." />;
  }

  if (error) {
    return <div className={classes.error}>Error loading data</div>;
  }

  return (
    <div className={classes.list}>
      <div className={classes.header}>
        <Back/>
        <div>
          <AddAssertForm/>
        </div>
      </div>

      <h3 className={classes.title}>List of all Assets</h3>

      {/* Table using Ant Design */}
      <div className={classes.tableContainer}>
        <Table
          columns={columns}
          dataSource={currentPageData}
          rowKey="_id"
          className={classes.table}
          pagination={false} // We're using custom pagination
        />
      </div>

      {/* Custom Pagination */}
      <div className={classes.pagination}>
        <div className={classes.paginationInfo}>
          Showing {startItem} to {endItem} of {totalItems} entries
        </div>

        <div className={classes.paginationControls}>
          <button
            className={`${classes.paginationButton} ${classes.frontBack}`}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <GrLinkPrevious className={classes.icon} />
            <span>Previous</span>
          </button>

          <span className={classes.pageIndicator}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={`${classes.paginationButton} ${classes.frontBack}`}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <GrLinkNext className={classes.icon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Asserts;