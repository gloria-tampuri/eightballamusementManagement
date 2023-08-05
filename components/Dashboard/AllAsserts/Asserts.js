import React, { useState } from 'react';
import classes from './Asserts.module.css';
import Link from 'next/link';
import useSWR from 'swr';
import { useRouter } from 'next/router';

const PAGE_SIZE = 10; // Number of items per page

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Asserts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const { data, error, isLoading } = useSWR('/api/asserts', fetcher);

  const location = data?.assert?.location;
  const current = location?.find((val) => val.currentLocation === true);

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = currentPage * PAGE_SIZE;

  return (
    <div className={classes.list}>
      <h3>List of Items</h3>

      {data?.asserts.slice(startIdx, endIdx).map((assert) => (
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
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <button
          disabled={endIdx >= data?.asserts.length}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Asserts;
