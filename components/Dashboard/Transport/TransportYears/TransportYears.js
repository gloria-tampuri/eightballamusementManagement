import Link from "next/link";
import React from "react";
import classes from "./TransportYears.module.css";
import useSWR from "swr";
import { useRouter } from "next/router";
import OperatorFilter from "../OperatorFilter/OperatorFilter";
import { useOperator } from "../../../../Context/OperatorContext";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const TransportYears = () => {
  const router = useRouter();
  const { selectedOperator } = useOperator();

  // Build URL with operator filter
  const url = selectedOperator
    ? `/api/transport/year?operator=${encodeURIComponent(selectedOperator)}`
    : "/api/transport/year";

  const { data, error } = useSWR(url, fetcher, { refreshInterval: 1000 });

  return (
    <div>
      <OperatorFilter />
      <div className={classes.year}>
        {data &&
          data.map((year, i) => (
            <Link
              key={i}
              className={classes.yearlistLink}
              href={`/dashboard/transport/${year}`}
            >
              <li className={classes.yearlist}> {year}</li>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default TransportYears;
