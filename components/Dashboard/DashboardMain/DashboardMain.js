import React, { useState, useEffect } from 'react'
import classes from './DashboardMain.module.css'
import useSWR from 'swr'
import CashUp from '../CashUp/CashUp'
import Link from 'next/link'
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import this line


const fetcher = (...args) => fetch(...args).then(res => res.json())


const DashboardMain = () => {
  const { data, error, isLoading } = useSWR('/api/asserts', fetcher)
  const router = useRouter()

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
          totalSales += sale.companyAmount;
        }
        if (saleMonth === currentMonth && saleYear === currentYear) {
          totalMonthlySales += sale.companyAmount;

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
          totalMonthlySales += sale.companyAmount;
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
          totalSales += sale.companyAmount;
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

  return (
    <div>
      <div className={classes.highlights}>
        <Link href='/dashboard/asserts' className={`${classes.box} ${classes.first}`}>
          <h1>{totalAssets}</h1>
          <h2>Total Number of Tables</h2>

        </Link>

        <div className={`${classes.box} ${classes.second}`}>
          <h1>{totalSalesYear}</h1>
          <h2>Total Income This Year</h2>

        </div>

        <div className={`${classes.box} ${classes.third}`}>
          <h1>{totalSalesMonth}</h1>
          <h2>Income This Month</h2>

        </div>
        <div className={`${classes.box} ${classes.fourth}`}>
          <h1>4000</h1>
          <h2>Total Expenditure</h2>

        </div>

        {/* <div className={`${classes.box} ${classes.fifth}`}>
          <h1>20150204 </h1>
          <p>Ayeduase</p>
          <h2>Best Performing site This Year</h2>

        </div>

        <div className={`${classes.box} ${classes.sixth}`}>
          <h1>20150204</h1>
          <p>Parkoso</p>
          <h2>Worst Performing Site This Year</h2>

        </div> */}
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

    </div>
  )
}

export default DashboardMain