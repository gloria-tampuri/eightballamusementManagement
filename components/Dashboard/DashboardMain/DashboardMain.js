import React, { useState, useEffect } from 'react'
import classes from './DashboardMain.module.css'
import { getSignedInEmail } from '../../../auth';
import useSWR from 'swr'
import CashUp from '../CashUp/CashUp'
import Link from 'next/link'
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import this line
import WeeklyCashups from '../WeeklyCashups/WeeklyCashups';
import OperatorDashboard from '../OperatordashBoard/OperatorDashboard';


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
    const currentMonth = currentDate.getMonth() + 1; 
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

  useEffect(() => {
    // Check if the signed-in email is the admin email
    getSignedInEmail()
        .then((email) => {
            if (email === 'richard.ababio@eightball.com') {
                setAdmin(true);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}, []);




//weekly cashups
const currentDate = new Date(); // Current date and time
const currentWeekStart = new Date(currentDate); // Start of the current week
currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the most recent Sunday
currentWeekStart.setHours(0, 0, 0, 0); // Set to midnight

const currentWeekEnd = new Date(currentWeekStart); // End of the current week
currentWeekEnd.setDate(currentWeekEnd.getDate() + 6); // Add 7 days for a week
currentWeekEnd.setHours(23, 59, 59, 999); // Set to the last millisecond of the day
let totalSum =0
// Include all assets in the data for the current week, regardless of their cash-up amounts
const currentWeekData = data?.asserts.map(assert => {
  const totalAmount = assert.cashup.reduce((total, sale) => {
    const saleDate = new Date(sale.cashupDate);
    if (saleDate >= currentWeekStart && saleDate <= currentWeekEnd) {
      total += sale.cashReceived;
    }
    return total;
  }, 0);
  totalSum += totalAmount
  return { ...assert, totalAmount };
});

    

  return (
  <>
  {
    admin ?  <div>
    <div className={classes.highlights}>
      <Link href='/dashboard/asserts' className={`${classes.box} ${classes.first}`}>
        <h1>{totalAssets}</h1>
        <p>Total Number of Assets</p>

      </Link>

     <Link href='/dashboard/allyear' className={`${classes.box} ${classes.second}`}>
     <div >
        <h1>
          {/* {totalSalesYear} */}
          0000
          </h1>
        <p>Total CashUp This Year</p>

      </div>
     </Link>

      <div className={`${classes.box} ${classes.third}`}>
        <h1>{totalSalesMonth}</h1>
        <p>CashUp This Month</p>

      </div>

      <Link href='/dashboard/weeklycashups'><div className={`${classes.box} ${classes.third}`}>
        <h1>{totalSum}</h1>
        <p>CashUp This Week</p>

      </div>
</Link>    
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
          {cashUpMonthlyTable?.map((arranged, index) =><tr key={arranged?._id} onClick={()=>router.push(`/dashboard/asserts/${arranged?._id}/cashup `)} 
          >  
            <td>{index + 1}</td>
            <td className={classes.color}>{arranged?.location.find((val) => val?.currentLocation === true)?.locationName}</td>
            <td>{arranged?.assertId}</td>

            <td
                className={`${classes.color} ${
                  arranged?.totalSalesCurrentMonth < 1200 ? classes.redBackground : ""
                }`}
              >{arranged?.totalSalesCurrentMonth}</td>
          </tr>
         )}
        </tbody>
      </table>
    </div>

  </div>:<div>
    <OperatorDashboard/>
  </div>
  }
  </>
  )
}

export default DashboardMain