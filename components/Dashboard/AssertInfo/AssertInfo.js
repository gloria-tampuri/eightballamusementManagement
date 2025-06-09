import React, { useMemo } from "react";
import classes from "./AssertInfo.module.css";
import useSWR from "swr";
import { useRouter } from "next/router";
import Back from "components/ui/back/back";
import AddButton from "components/ui/button/button";
import Spinner from "components/ui/spinner/spinner";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const AssertInfo = () => {
  const router = useRouter();
  const { assert } = router.query;

  // Don't fetch if assert ID is not available yet
  const shouldFetch = assert && typeof assert === 'string';
  const { data, error, isLoading } = useSWR(
    shouldFetch ? `/api/asserts/${assert}` : null, 
    fetcher
  );

  // Memoize current location calculation
  const currentLocation = useMemo(() => {
    const locations = data?.assert?.location;
    return locations?.find((location) => location.currentLocation === true);
  }, [data?.assert?.location]);

  // Memoize action handlers to prevent unnecessary re-renders
  const handleCashUpClick = useMemo(
    () => () => router.push(`/dashboard/asserts/${assert}/cashup`),
    [router, assert]
  );

  const handleLocationUpdateClick = useMemo(
    () => () => router.push(`/dashboard/asserts/${assert}/location`),
    [router, assert]
  );

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const displayValue = (value, fallback = "N/A") => {
    return value && value.toString().trim() ? value : fallback;
  };

  if (isLoading) {
    return <Spinner overlay size="large" color="white" text="Loading assets..." />;
  }

  if (error) {
    return <div className={classes.error}>Error loading data</div>;
  }



  if (!data?.assert) {
    return (
      <div className={classes.assert}>
        <div className={classes.header}>
          <Back />
        </div>
        <div className={classes.errorContainer}>
          <div className={classes.error}>
            <h3>Asset Not Found</h3>
            <p>The requested asset could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.assert}>
      <div className={classes.header}>
        <Back />
        <div className={classes.actions}>
          <AddButton
            text="Cash Ups"
            onClick={handleCashUpClick}
          />
          <AddButton
            text="Update Location"
            onClick={handleLocationUpdateClick}
          />
        </div>
      </div>

      <div className={classes.content}>
        <h2 className={classes.title}>
          {displayValue(currentLocation?.locationName, "Asset Information")}
        </h2>

        <div className={classes.summaryContainer}>
          <h3 className={classes.sectionTitle}>Asset Details</h3>
          <ul className={classes.summary}>
            <li className={classes.summaryItem}>
              <span className={classes.label}>Asset Number:</span>
              <span className={classes.value}>
                {displayValue(data.assert.assertId)}
              </span>
            </li>
            
            <li className={classes.summaryItem}>
              <span className={classes.label}>Date Installed:</span>
              <span className={classes.value}>
                {formatDate(currentLocation?.startDate)}
              </span>
            </li>
            
            <li className={classes.summaryItem}>
              <span className={classes.label}>Current Location:</span>
              <span className={classes.value}>
                {displayValue(currentLocation?.locationName)}
              </span>
            </li>
            
            <li className={classes.summaryItem}>
              <span className={classes.label}>Site Telephone:</span>
              <span className={classes.value}>
                {displayValue(currentLocation?.telephoneNumber)}
              </span>
            </li>
            
            <li className={classes.summaryItem}>
              <span className={classes.label}>Current Tokens:</span>
              <span className={classes.value}>
                {displayValue(currentLocation?.numberofTokens)}
              </span>
            </li>
            
            <li className={classes.summaryItem}>
              <span className={classes.label}>Table Accessories:</span>
              <span className={classes.value}>
                {displayValue(currentLocation?.accessories)}
              </span>
            </li>
          </ul>
        </div>

        {/* Location History Section */}
        {data.assert.location && data.assert.location.length > 1 && (
          <div className={classes.historyContainer}>
            <h3 className={classes.sectionTitle}>Location History</h3>
            <div className={classes.locationHistory}>
              {data.assert.location
                .filter(loc => !loc.currentLocation)
                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                .map((location, index) => (
                  <div key={index} className={classes.historyItem}>
                    <div className={classes.historyLocation}>
                      {location.locationName}
                    </div>
                    <div className={classes.historyDate}>
                      {formatDate(location.startDate)}
                      {location.endDate && ` - ${formatDate(location.endDate)}`}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssertInfo;