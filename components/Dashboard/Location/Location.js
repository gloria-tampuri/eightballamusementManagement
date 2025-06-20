import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

import LocationList from "./LocationList";
import LocationDialog from "./LocationDialog";
import styles from "./Location.module.css";
import Back from "components/ui/back/back";
import Spinner from "components/ui/spinner/spinner";



const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Location = () => {
  const router = useRouter();
  const { assert } = router.query;
  

  const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher);


  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.errorText}>
          Error loading asset data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Back />
        </div>
        <div>
          {" "}
          <LocationDialog />
        </div>
      </div>
      <h2 className={styles.title}>
        Location Management
      </h2>

      <p
        className={styles.title}
      >
        Managing locations for Asset ID:{" "}
        <strong>{data?.assert?.assertId}</strong>
      </p>
      <LocationList />
    </div>
  );
};

export default Location;
