import React from 'react'
import classes from './Asserts.module.css'
import Link from 'next/link'
import useSWR from 'swr'
import { useRouter } from 'next/router'

const fetcher = (...args) => fetch(...args).then(res => res.json())


const Asserts = () => {
   
  const router = useRouter()
 

  const { data, error, isLoading } = useSWR('/api/asserts', fetcher)
    console.log(data);
  return (
    <div className={classes.list}>
    <h3>List of Items</h3>

  {data?.asserts.map((assert)=>  <Link href={`/dashboard/asserts/${assert._id}`} key={assert._id}>
      <div className={classes.item}>
     <div className={classes.info}> <h4>{assert.assertId}</h4>
      <p>Parkoso</p></div>
      <div className={classes.action}>
      {/* <Link className={classes.edit} href={`/dashboard/asserts/${assert_id}`}> Edit</Link> */}
      <p className={classes.delete}>Delete</p>
      </div>
      </div>
    </Link>)}
  </div>
  )
}

export default Asserts