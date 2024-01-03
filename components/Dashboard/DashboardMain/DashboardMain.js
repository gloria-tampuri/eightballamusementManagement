import React, { useState, useEffect } from 'react'
import classes from './DashboardMain.module.css'
import { getSignedInEmail } from '../../../auth';
import useSWR from 'swr'
import CashUp from '../CashUp/CashUp'
import Link from 'next/link'
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import this line
import WeeklyCashups from '../WeeklyCashups/WeeklyCashups';


const fetcher = (...args) => fetch(...args).then(res => res.json())


const DashboardMain = () => {
  const { data, error, isLoading } = useSWR('/api/asserts', fetcher)
  const router = useRouter()

  const[admin, setAdmin]= useState(false)

  const allAssets = data?.asserts
  const [totalAssets, setTotalAssets] = useState(0);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
  const date = new Date()
        const monthIndex = date.getMonth();
        const monthName = monthNames[monthIndex];

  useEffect(() => {
    const fetchedAsserts = data?.asserts
    const totalnumber = fetchedAsserts?.length
    setTotalAssets(totalnumber)
  }, [data])

  const calculateYearTotalSales = (documents) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1 to get the current month

    let totalSales = 0;
    let totalMonthlySales = 0;

    documents?.forEach((document) => {
      const sales = document?.cashup;

      sales.forEach((sale) => {
        const saleDate = new Date(sale.cashupDate);
        const saleYear = saleDate.getFullYear();
        const saleMonth = saleDate.getMonth() + 1;

        if (saleYear === currentYear) {
          totalSales += sale.cashReceived;
        }
        if (saleMonth === currentMonth && saleYear === currentYear) {
          totalMonthlySales += sale.cashReceived;

        }
      });
    });
    return totalSales
    // setTotalSalesYear(totalSales)
    // setTotalSalesMonth(totalMonthlySales)
  };
  const totalSalesYear = calculateYearTotalSales(allAssets);

  const calculateMonthTotalSales = (documents) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1 to get the current month
    let totalMonthlySales = 0;

    documents?.forEach((document) => {
      const sales = document?.cashup;

      sales.forEach((sale) => {
        const saleDate = new Date(sale.cashupDate);
        const saleYear = saleDate.getFullYear();
        const saleMonth = saleDate.getMonth() + 1;

        if (saleMonth === currentMonth && saleYear === currentYear) {
          totalMonthlySales += sale.cashReceived;
        }
      });
    });
    return totalMonthlySales
  };
  const totalSalesMonth = calculateMonthTotalSales(allAssets)

  const calculateArrangeTotalSales = (documents) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index

    documents?.forEach((document) => {
      let totalSales = 0;
      document?.cashup?.forEach((sale) => {
        const saleDate = new Date(sale.cashupDate);
        const saleYear = saleDate.getFullYear();
        const saleMonth = saleDate.getMonth() + 1;

        if (saleYear === currentYear && saleMonth === currentMonth) {
          totalSales += sale.cashReceived;
        }
      });

      document.totalSalesCurrentMonth = totalSales || 0; // Set default value as 0 if totalSales is null or undefined
    });

    // Sort documents based on the total sales in the current month
    documents?.sort((a, b) => b.totalSalesCurrentMonth - a.totalSalesCurrentMonth);

    // Now documents array is sorted based on the total sales in the current month
    return documents
  };


  const cashUpMonthlyTable = calculateArrangeTotalSales(allAssets)

  getSignedInEmail()
  .then((email) => {
    console.log("Signed-in email:", email);
    if(email === 'richard.ababio@eightball.com'){
      setAdmin(true)
    }
  })
  .catch((error) => {
    console.error(error);
  });
  console.log(admin);

    

  return (
  <>
  {
    admin ?  <div>
    <div className={classes.highlights}>
      <Link href='/dashboard/asserts' className={`${classes.box} ${classes.first}`}>
        <h1>{totalAssets}</h1>
        <h2>Total Number of Tables</h2>

      </Link>

     <Link href='/dashboard/allyear' className={`${classes.box} ${classes.second}`}>
     <div >
        <h1>
          {/* {totalSalesYear} */}
          <p>0000</p>
          </h1>
        <h2>Total Income This Year</h2>

      </div>
     </Link>

      <div className={`${classes.box} ${classes.third}`}>
        <h1>{totalSalesMonth}</h1>
        <h2>Income This Month</h2>

      </div>

    </div>

    <div className={classes.list}>
      <h2 className={classes.tabheader}>Performance of all assets this month of {monthName}</h2>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Location</th>
            <th>AssetID</th>
            <th>Cashup Amount</th>
          </tr>
        </thead>

        <tbody>
          {cashUpMonthlyTable?.map((arranged, index) =><tr key={arranged?._id} onClick={()=>router.push(`/dashboard/asserts/${arranged?._id}/cashup `)} > 
            
            <td>{index + 1}</td>
            <td className={classes.color}>{arranged?.location.find((val) => val?.currentLocation === true)?.locationName}</td>
            <td>{arranged?.assertId}</td>

            <td className={classes.color}>{arranged?.totalSalesCurrentMonth}</td>
           
          </tr>
         )}
        </tbody>
      </table>
    </div>

  </div>:<div>
    <h1 className={classes.operatorHeader}>Operator Dashboard</h1>
    <WeeklyCashups/>
  </div>
  }
  </>
  )
}

export default DashboardMain