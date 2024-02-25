import React, { useState } from 'react';
import classes from './Asserts.module.css';
import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { GrLinkPrevious } from "react-icons/gr";
import { GrLinkNext } from "react-icons/gr";


const PAGE_SIZE = 10; // Number of items per page

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Asserts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const { data, error, isLoading } = useSWR('/api/asserts', fetcher);

  // Check if data is loading or not available
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  // Sort the asserts array by timestamp in descending order (most recent first)
  const sortedAsserts = data.asserts.slice().sort((a, b) => b.timestamp - a.timestamp);

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = currentPage * PAGE_SIZE;

  return (
    <div className={classes.list}>
      <h3>List of all Assets</h3>

      {sortedAsserts.slice(startIdx, endIdx).map((assert) => (
        <Link href={`/dashboard/asserts/${assert._id}`} key={assert._id}>
          <div className={classes.item}>
            <div className={classes.info}>
              <h4>{assert.assertId}</h4>
              {assert.location.map((val) => (
                <p key={val.locationName}>
                  {val.currentLocation === true && val.locationName}
                </p>
              ))}
            </div>
            <div className={classes.action}>
              <p className={classes.delete}>Delete</p>
            </div>
          </div>
        </Link>
      ))}

      <div className={classes.pagination}>
        <button
        className={classes.frontBack}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <GrLinkPrevious className={classes.icon}/>
          Previous
        </button>
        <button
        className={classes.frontBack}
          disabled={endIdx >= sortedAsserts.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
          <GrLinkNext className={classes.icon}/>
        </button>
      </div>
    </div>
  );
};

export default Asserts;
