import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import classes from "./List.module.css";
import useSWR from "swr";
import { getSignedInEmail } from "../../../auth";
import { useRouter } from "next/router";
import { AiOutlineDelete,  } from "react-icons/ai";
import { FiPrinter, FiEye, FiEyeOff } from "react-icons/fi";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import Delete from "../Delete/Delete";
import { DeleteContext } from "../../../Context/DeleteContext";
import { ReceiptContext } from "../../../Context/CashupReciept";
import ReceiptModal from "../ReceiptModal/ReceiptModal";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

// Constants
const MONTH_NAMES = [
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

const ADMIN_EMAIL = "richard.ababio@eightball.com";

// Custom hooks
const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSignedInEmail()
      .then((email) => {
        setIsAdmin(email === ADMIN_EMAIL);
      })
      .catch((error) => {
        console.error("Auth error:", error);
        setIsAdmin(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { isAdmin, isLoading };
};

// Utility functions
const formatCurrency = (amount) => {
  const numAmount = parseFloat(amount) || 0;
  return `GHC ${numAmount.toFixed(2)}`;
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("en-GB");
  } catch {
    return dateString;
  }
};

const safeParseFloat = (value) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

// Data processing functions
const groupCashupByYearAndMonth = (cashupData) => {
  if (!Array.isArray(cashupData)) return [];

  const grouped = cashupData.reduce((result, cash) => {
    const date = new Date(cash.cashupDate);
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const monthName = MONTH_NAMES[monthIndex];

    if (!result[year]) result[year] = {};
    if (!result[year][monthName]) result[year][monthName] = [];

    result[year][monthName].push(cash);
    return result;
  }, {});

  return Object.entries(grouped)
    .map(([year, months]) => ({
      year: parseInt(year),
      months: Object.entries(months).map(([month, items]) => {
        const totalAmount = items.reduce(
          (sum, item) => sum + safeParseFloat(item.cashReceived),
          0
        );
        return {
          month,
          items,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          itemCount: items.length,
        };
      }),
    }))
    .map(({ year, months }) => {
      const yearTotal = months.reduce(
        (sum, { totalAmount }) => sum + totalAmount,
        0
      );
      return {
        year,
        months,
        totalAmount: parseFloat(yearTotal.toFixed(2)),
        itemCount: months.reduce((sum, { itemCount }) => sum + itemCount, 0),
      };
    })
    .sort((a, b) => b.year - a.year);
};

// Components
const LoadingSpinner = () => (
  <div className={classes.loadingContainer}>
    <div className={classes.spinner}></div>
    <p>Loading cashup data...</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className={classes.errorContainer}>
    <p className={classes.errorMessage}>⚠️ {message}</p>
  </div>
);

const RevenueHeader = ({ totalRevenue, showTotal, onToggle }) => (
  <div>
    <div className={classes.revenueContent} onClick={onToggle}>
      <h2 className={classes.revenueTitle}>
        Total Revenue
        {showTotal && (
          <span className={classes.revenueAmount}>
            {formatCurrency(totalRevenue)}
          </span>
        )}
      </h2>
      {showTotal ? <FiEyeOff /> : <FiEye />}
    </div>
  </div>
);

const YearHeader = ({ year, totalAmount, itemCount, isExpanded, onToggle }) => (
  <div className={classes.yearHeader} onClick={onToggle}>
    <div className={classes.yearContent}>
      <h3 className={classes.yearTitle}>{year}</h3>
      <div className={classes.yearStats}>
        <span className={classes.yearAmount}>
          {formatCurrency(totalAmount)}
        </span>
        <span className={classes.yearCount}>({itemCount} entries)</span>
      </div>
    </div>
    {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
  </div>
);

const MonthHeader = ({
  month,
  totalAmount,
  itemCount,
  isExpanded,
  onToggle,
}) => (
  <div className={classes.monthHeader} onClick={onToggle}>
    <div className={classes.monthContent}>
      <span className={classes.monthTitle}>{month}</span>
      <div className={classes.monthStats}>
        <span className={classes.monthAmount}>
          {formatCurrency(totalAmount)}
        </span>
        <span className={classes.monthCount}>({itemCount} entries)</span>
      </div>
    </div>
    {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
  </div>
);

const CashupTable = ({ items, onDelete, onPrintReceipt }) => {
  return (
    <div className={classes.tableContainer}>
      <div className={classes.tableWrapper}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.tableHeader}>Date</th>
              <th className={classes.tableHeader}>Time</th>
              <th className={classes.tableHeader}>Location</th>
              <th className={`${classes.tableHeader} ${classes.alignRight}`}>Tokens Sold</th>
              <th className={`${classes.tableHeader} ${classes.alignRight}`}>Total Sale</th>
              <th className={`${classes.tableHeader} ${classes.alignRight}`}>Company Share</th>
              <th className={`${classes.tableHeader} ${classes.alignRight}`}>Cash Received</th>
              <th className={`${classes.tableHeader} ${classes.alignRight}`}>Balance</th>
              <th className={classes.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.cashupId} className={classes.tableRow}>
                <td className={classes.tableCell}>
                  {formatDate(item.cashupDate)}
                </td>
                <td className={classes.tableCell}>
                  {item.cashupTime}
                </td>
                <td className={classes.tableCell}>
                  {item.location}
                </td>
                <td className={`${classes.tableCell} ${classes.numberCell} ${classes.alignRight}`}>
                  {item.tokensSold}
                </td>
                <td className={`${classes.tableCell} ${classes.alignRight}`}>
                  <span className={classes.numberCell}>
                    {formatCurrency(item.totalSale)}
                  </span>
                </td>
                <td className={`${classes.tableCell} ${classes.alignRight}`}>
                  <span className={classes.companyShareCell}>
                    {formatCurrency(item.companyAmount)}
                  </span>
                </td>
                <td className={`${classes.tableCell} ${classes.alignRight}`}>
                  <span className={classes.numberCell}>
                    {formatCurrency(item.cashReceived)}
                  </span>
                </td>
                <td className={`${classes.tableCell} ${classes.alignRight}`}>
                  <span
                    className={`${classes.numberCell} ${
                      parseFloat(item.balance) < 0 
                        ? classes.negativeBalance 
                        : classes.positiveBalance
                    }`}
                  >
                    {formatCurrency(item.balance)}
                  </span>
                </td>
                <td className={classes.tableCell}>
                  <div className={classes.actionsCell}>
                    <button
                      className={classes.actionButton}
                      onClick={() => onDelete(item.cashupId)}
                      title="Delete entry"
                      aria-label="Delete cashup entry"
                    >
                      <AiOutlineDelete />
                    </button>
                    <button
                      className={classes.actionButton}
                      onClick={() => onPrintReceipt(item)}
                      title="Print receipt"
                      aria-label="Print receipt"
                    >
                      <FiPrinter />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CashUpList = () => {
  const router = useRouter();
  const { assert } = router.query;

  // Context
  const deleteCtx = useContext(DeleteContext);
  const receiptContext = useContext(ReceiptContext);
  const { showDeleteModal, deleteModal } = deleteCtx;
  const { receiptModal, setReceiptData, showReceiptModal } = receiptContext;

  // Auth
  const { isAdmin, isLoading: authLoading } = useAuth();

  // Data fetching
  const { data, error, isLoading } = useSWR(
    assert ? `/api/asserts/${assert}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  // State
  const [selectedCashupId, setSelectedCashupId] = useState(null);
  const [showTotalRevenue, setShowTotalRevenue] = useState(false);
  const [expandedYear, setExpandedYear] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);

  // Memoized calculations
  const cashupData = useMemo(() => data?.assert?.cashup || [], [data]);

  const totalRevenue = useMemo(() => {
    return cashupData.reduce(
      (sum, cashup) => sum + safeParseFloat(cashup.cashReceived),
      0
    );
  }, [cashupData]);

  const groupedData = useMemo(() => {
    return groupCashupByYearAndMonth(cashupData);
  }, [cashupData]);

  // Event handlers
  const handleToggleTotalRevenue = useCallback(() => {
    setShowTotalRevenue((prev) => !prev);
  }, []);

  const handleToggleYear = useCallback((year) => {
    setExpandedYear((prev) => (prev === year ? null : year));
    setExpandedMonth(null); // Close any open month when switching years
  }, []);

  const handleToggleMonth = useCallback((monthKey) => {
    setExpandedMonth((prev) => (prev === monthKey ? null : monthKey));
  }, []);

  const handleDelete = useCallback(
    (cashupId) => {
      if (!cashupId) return;
      setSelectedCashupId(cashupId);
      showDeleteModal();
    },
    [showDeleteModal]
  );

  const handlePrintReceipt = useCallback(
    (cash) => {
      if (!cash) return;
      setReceiptData(cash);
      showReceiptModal(cash);
    },
    [setReceiptData, showReceiptModal]
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Loading states
  if (authLoading || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage message="Failed to load cashup data. Please try again." />
    );
  }

  if (!isAdmin) {
    return (
      <div className={classes.unauthorizedContainer}>
        <p className={classes.unauthorizedMessage}>
          🔒 Access restricted. Admin privileges required.
        </p>
      </div>
    );
  }

  if (!cashupData.length) {
    return (
      <div className={classes.emptyContainer}>
        <p className={classes.emptyMessage}>
          📊 No cashup data available for this location.
        </p>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <RevenueHeader
          totalRevenue={totalRevenue}
          showTotal={showTotalRevenue}
          onToggle={handleToggleTotalRevenue}
        />
      </div>

      <div className={classes.content}>
        {groupedData.map((yearData) => (
          <div key={yearData.year} className={classes.yearSection}>
            <YearHeader
              year={yearData.year}
              totalAmount={yearData.totalAmount}
              itemCount={yearData.itemCount}
              isExpanded={expandedYear === yearData.year}
              onToggle={() => handleToggleYear(yearData.year)}
            />

            {expandedYear === yearData.year && (
              <div className={classes.monthsContainer}>
                {yearData.months.map((monthData) => {
                  const monthKey = `${yearData.year}-${monthData.month}`;
                  return (
                    <div key={monthKey} className={classes.monthSection}>
                      <MonthHeader
                        month={monthData.month}
                        totalAmount={monthData.totalAmount}
                        itemCount={monthData.itemCount}
                        isExpanded={expandedMonth === monthKey}
                        onToggle={() => handleToggleMonth(monthKey)}
                      />

                      {expandedMonth === monthKey && (
                        <CashupTable
                          items={monthData.items}
                          onDelete={handleDelete}
                          onPrintReceipt={handlePrintReceipt}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      {receiptModal && <ReceiptModal />}
      {deleteModal && (
        <Delete
          assertId={assert}
          routeUrl="cashup"
          selectedId={selectedCashupId}
        />
      )}
    </div>
  );
};

export default CashUpList;