import React, { useContext, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePrinter } from "react-icons/ai";
import useSWR from "swr";
import { useRouter } from "next/router";
import Delete from "../Delete/Delete";
import { DeleteContext } from "../../../Context/DeleteContext";
import { EditContext } from "../../../Context/EditContext";
import EditModal from "../EditModal/EditModal";
import styles from "./List.module.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const LocationList = () => {
  const router = useRouter();
  const { assert } = router.query;
  const deleteCtx = useContext(DeleteContext);
  const editCtx = useContext(EditContext);
  const { showDeleteModal, deleteModal } = deleteCtx;
  const { showEditModal, editModal } = editCtx;
  const [selectedLocationId, setSelectedLocationId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, error } = useSWR(`/api/asserts/${assert}`, fetcher, {
    refreshInterval: 1000,
  });

  const deleteHandler = (id) => {
    setSelectedLocationId(id);
    showDeleteModal();
  };

  const editHandler = (id) => {
    setSelectedLocationId(id);
    showEditModal();
  };

  const tableData = data?.assert?.location
    ?.slice()
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .map(item => ({ ...item, key: item.locationId })) || [];

  // Pagination logic
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    return (
      <div>
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  if (error) {
    return <div>Error loading location data</div>;
  }

  return (
    <div>
      {/* <button 
        onClick={() => window.print()}
        className="printButton"
      >
        <AiOutlinePrinter />
        Print
      </button> */}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Location Name</th>
              <th className={styles.tableHeader}>Physical Address</th>
              <th className={styles.tableHeader}>Site Owner</th>
              <th className={styles.tableHeader}>Telephone</th>
              <th className={styles.tableHeader}>Tokens Given</th>
              <th className={styles.tableHeader}>Accessories</th>
              <th className={styles.tableHeader}>Commence Date</th>
              <th className={styles.tableHeader}>End Date</th>
              <th className={styles.tableHeader}>GPS Co-ordinates</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((record, index) => (
              <tr key={record.locationId} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <strong>{record.locationName}</strong>
                </td>
                <td className={styles.tableCell}>
                  {record.physicalAddress}
                </td>
                <td className={styles.tableCell}>
                  {record.siteOwner}
                </td>
                <td className={styles.tableCell}>
                  {record.telephoneNumber}
                </td>
                <td className={`${styles.tableCell} ${styles.numberCell}`}>
                  <strong>{record.numberofTokens}</strong>
                </td>
                <td className={styles.tableCell}>
                  {record.accessories || '-'}
                </td>
                <td className={styles.tableCell}>
                  {record.startDate}
                </td>
                <td className={styles.tableCell}>
                  <strong>{record.endDate === "" ? 'Current Location' : record.endDate}</strong>
                </td>
                <td className={styles.tableCell}>
                  {record.gpsAddress ? (
                    <div>
                      {record.gpsAddress.map((coordinate, index) => (
                        <div key={index}>{coordinate}</div>
                      ))}
                    </div>
                  ) : (
                    <div>No GPS coordinates available</div>
                  )}
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.actionsCell}>
                    <button className={styles.actionButton} onClick={() => editHandler(record.locationId)}>
                      <AiOutlineEdit />
                    </button>
                    <button className={styles.actionButton} onClick={() => deleteHandler(record.locationId)}>
                      <AiOutlineDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}

      {deleteModal && (
        <Delete
          assertId={assert}
          routeUrl="location"
          selectedId={selectedLocationId}
        />
      )}
      {editModal && (
        <EditModal
          assertId={assert}
          routeUrl="location"
          selectedId={selectedLocationId}
        />
      )}
    </div>
  );
};

export default LocationList;