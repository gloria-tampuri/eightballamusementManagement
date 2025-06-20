import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { getSignedInEmail } from '../../../../auth';
import Back from "components/ui/back/back";
import styles from './TransportByMonth.module.css';
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TransportByMonth = () => {
  const router = useRouter();
  const { year } = router.query;
  const { data, error, mutate } = useSWR(
    `/api/transport/year/${year}`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const [admin, setAdmin] = useState(false);
  const [activePanels, setActivePanels] = useState({});
  const [paidWeeks, setPaidWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const email = await getSignedInEmail();
        setAdmin(email === 'richard.ababio@eightball.com');
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    checkAdminStatus();
  }, []);

  const deleteHandler = async (transportId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transport/${transportId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        alert("Transport record deleted successfully");
        mutate();
      } else {
        throw new Error("Failed to delete transport record");
      }
    } catch (error) {
      console.error("Error deleting transport:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markWeekAsPaid = async (weekKey) => {
    try {
      setLoading(true);
      const transportsToUpdate = groupedData
        .flatMap(month => month.weeks)
        .filter(week => week.key === weekKey)
        .flatMap(week => week.transports);

      const updatePromises = transportsToUpdate.map(transport => 
        fetch(`/api/transport/${transport._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: transport._id, update: { paid: true } }),
        })
      );

      await Promise.all(updatePromises);
      setPaidWeeks([...paidWeeks, weekKey]);
      alert(`Week ${weekKey} marked as paid`);
      mutate();
    } catch (error) {
      console.error("Error marking week as paid:", error);
      alert("Failed to mark week as paid");
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = (panelKey) => {
    setActivePanels(prev => ({
      ...prev,
      [panelKey]: !prev[panelKey]
    }));
  };

  const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  };

  const formatDateRange = (date) => {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(start.getDate() + 6);
    
    if (isMobile) {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const groupedData = useMemo(() => {
    if (!data?.transport) return [];

    const grouped = data.transport.reduce((acc, transport) => {
      const date = new Date(transport.transportDate);
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      const weekNumber = getWeekNumber(date);
      const weekKey = `${monthName}-${weekNumber}`;

      let month = acc.find(m => m.month === monthName);
      if (!month) {
        month = { month: monthName, monthIndex, weeks: [] };
        acc.push(month);
      }

      let week = month.weeks.find(w => w.key === weekKey);
      if (!week) {
        week = {
          key: weekKey,
          weekNumber,
          dateRange: formatDateRange(date),
          transports: [],
          totalAmount: 0,
          allPaid: true
        };
        month.weeks.push(week);
      }

      week.transports.push(transport);
      week.totalAmount += transport.amount;
      if (!transport.paid) week.allPaid = false;

      return acc;
    }, []);

    return grouped
      .sort((a, b) => b.monthIndex - a.monthIndex)
      .map(month => ({
        ...month,
        weeks: month.weeks.sort((a, b) => b.weekNumber - a.weekNumber)
      }));
  }, [data, isMobile]);

  const confirmDelete = (transportId) => {
    if (window.confirm("Delete this record?")) {
      deleteHandler(transportId);
    }
  };

  if (error) return (
    <div className={styles.errorAlert}>
      <div className={styles.alertIcon}>!</div>
      <div>
        <h4>Error Loading Data</h4>
        <p>{error.message}</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Back/>
        <h1 className={styles.title}>Transport {year}</h1>
      </div>

      {groupedData.map(({ month, weeks }) => (
        <div key={month} className={styles.monthCard}>
          <div className={styles.monthHeader}>
            <h2 className={styles.monthTitle}>{month}</h2>
          </div>
          
          <div className={styles.weeksContainer}>
            {weeks.map(week => (
              <div key={week.key} className={styles.weekPanel}>
                <div 
                  className={styles.weekHeader}
                  onClick={() => togglePanel(week.key)}
                >
                  <div className={styles.weekInfo}>
                    <div className={styles.weekMainInfo}>
                      <span className={styles.weekNumber}>Week {week.weekNumber}</span>
                      <span className={styles.weekDates}>{week.dateRange}</span>
                    </div>
                    <div className={styles.weekStatus}>
                      <span className={`${styles.statusTag} ${week.allPaid ? styles.paid : styles.pending}`}>
                        {week.allPaid ? "All Paid" : "Pending"}
                      </span>
                      <span className={styles.weekTotal}>₵{week.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className={styles.weekToggle}>
                    {activePanels[week.key] ? '−' : '+'}
                  </div>
                </div>
                
                {activePanels[week.key] && (
                  <div className={styles.weekContent}>
                    {isMobile ? (
                      <div className={styles.mobileList}>
                        {week.transports.map(transport => (
                          <div key={transport._id} className={styles.mobileItem}>
                            <div className={styles.mobileItemMain}>
                              <div className={styles.mobileDate}>
                                {new Date(transport.transportDate).toLocaleDateString()}
                              </div>
                              <div className={styles.mobileRoute}>
                                <strong>{transport.from}</strong>
                                <span> → {transport.destination}</span>
                              </div>
                              <span className={`${styles.mobileStatus} ${transport.paid ? styles.paid : styles.pending}`}>
                                {transport.paid ? "Paid" : "Pending"}
                              </span>
                            </div>
                            <div className={styles.mobileItemSide}>
                              <div className={styles.mobileAmount}>
                               ₵{transport.amount.toLocaleString()}
                              </div>
                              {admin && (
                                <button 
                                  className={styles.deleteButton}
                                  onClick={() => confirmDelete(transport._id)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <table className={styles.transportTable}>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Route</th>
                            <th>Amount</th>
                            <th>Status</th>
                            {admin && <th>Actions</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {week.transports.map(transport => (
                            <tr key={transport._id}>
                              <td>{new Date(transport.transportDate).toLocaleDateString()}</td>
                              <td>
                                <div>
                                  <strong>{transport.from}</strong>
                                  <div className={styles.routeDestination}>to {transport.destination}</div>
                                </div>
                              </td>
                              <td className={styles.amountCell}>₵{transport.amount.toLocaleString()}</td>
                              <td>
                                <span className={`${styles.statusTag} ${transport.paid ? styles.paid : styles.pending}`}>
                                  {transport.paid ? "Paid" : "Pending"}
                                </span>
                              </td>
                              {admin && (
                                <td>
                                  <button 
                                    className={styles.deleteButton}
                                    onClick={() => confirmDelete(transport._id)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    
                    {admin && (
                      <div className={styles.weekActions}>
                        <button
                          className={`${styles.payButton} ${week.allPaid ? styles.paid : ''}`}
                          onClick={() => markWeekAsPaid(week.key)}
                          disabled={week.allPaid || loading}
                        >
                          {loading ? 'Processing...' : week.allPaid ? '✓ All Paid' : 'Mark Week as Paid'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransportByMonth;