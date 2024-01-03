import React, { useContext, useEffect, useState } from 'react'
import classes from './List.module.css'
import useSWR from 'swr'
import { getSignedInEmail } from '../../../auth';
import { useRouter } from 'next/router'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import Delete from '../Delete/Delete'
import { DeleteContext } from '../../../Context/DeleteContext'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range'


const fetcher = (...args) => fetch(...args).then(res => res.json())

const CashUpList = () => {
    const router = useRouter()
    const { assert } = router.query
    const deleteCtx = useContext(DeleteContext)
    const { showDeleteModal, deleteModal } = deleteCtx
    const [selectedCashupId, setSelectedCashupId] = useState()
    const [showMonths, setShowMonths] = useState(false)
    const [showCashupInMonth, setShowCashupInMonth] = useState(null)
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [showTotalRevenue, setShowTotalRevenue] = useState(false);

  const handleToggleTotalRevenue = () => {
    setShowTotalRevenue(!showTotalRevenue);
  };
    const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher)


    const [allProducts, setAllProducts] = useState(() => data?.assert?.cashup)
    const [filteredCashup, setFilteredCashup] = useState()

    const handlePrint = () => {
        window.print();
      };
    

    useEffect(() => {
        if (data?.status === 200) {
            setAllProducts(data?.assert?.cashup)
        }

    }, [data]);

    useEffect(() => {
        const data = allProducts && allProducts
        setFilteredCashup(data)
    }, [allProducts]);

    const deleteHandler = (id) => {
        setSelectedCashupId(id);
        showDeleteModal()
    }

    


    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const groupedDataByYear = data?.assert?.cashup.reduce((result, cash) => {
        const date = new Date(cash.cashupDate)
        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        const monthName = monthNames[monthIndex];
        // const key = `${year}`;

        if (!result[year]) {
            result[year] = {}
        }
        if (!result[year][monthName]) {
            result[year][monthName] = []
        }
        result[year][monthName].push(cash);

        return result;

    }, {})

    const groupedDataArray = groupedDataByYear ? Object.entries(groupedDataByYear).map(([year, months]) => ({
        year,
        months: Object.entries(months).map(([month, items]) => ({
            month,
            items
        }))
    })) : []

    const groupedDataArrayWithAmounts = groupedDataArray.map(({ year, months }) => {
        const monthsWithAmounts = months.map(({ month, items }) => {
            const totalAmount = items.reduce((sum, item) => {
                const itemAmount = parseFloat(item.cashReceived);
                return isNaN(itemAmount) ? sum : sum + itemAmount;
            }, 0);
            const formattedTotalAmount = parseFloat(totalAmount.toFixed(2));
            return { month, items, totalAmount: formattedTotalAmount };
        });
        
        const totalAmount = monthsWithAmounts.reduce((sum, { totalAmount }) => sum + (typeof totalAmount === 'number' ? totalAmount : 0), 0);
        const formattedTotalAmount = parseFloat(totalAmount.toFixed(2));
        return { year, months: monthsWithAmounts, totalAmount: formattedTotalAmount };
      });
      // Sort the years with the most current year first
  groupedDataArrayWithAmounts.sort((a, b) => parseInt(b.year) - parseInt(a.year));

    const handleMonths = (year) => {
        setShowMonths(showMonths === year ? undefined : year)

    }
    const handleCashupInMonth = (month) => {

        setShowCashupInMonth(showCashupInMonth === month ? undefined : month)

    }
    
    

    useEffect(() => {
        const totalRevenue = data?.assert?.cashup?.map(cashup => +cashup.cashReceived).reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
        )
        setTotalRevenue(totalRevenue)
    }, [data])



    const[admin, setAdmin]= useState(false)

    getSignedInEmail()
    .then((email) => {
      if(email === 'richard.ababio@eightball.com'){
        setAdmin(true)
      }
    })
    .catch((error) => {
      console.error(error);
    });



    return (
       <>{admin? <div>
       <h2 onClick={handleToggleTotalRevenue}>
Total Revenue of Table <span>{showTotalRevenue ? totalRevenue : ''}</span>
</h2>


 <div className={classes.list}>
 <button className='printButton' onClick={() => window.print()}>Print</button>
     {groupedDataArrayWithAmounts.map((list) => <div key={list.year}>
         <div>
         
             <h1 className={classes.years} onClick={() => handleMonths(list.year)}>{list.year}, <span className={classes.amount}> GHC {list.totalAmount}</span>  </h1>
            
             {showMonths === list.year ? <div>{list.months.map((month) =>
                 <div key={month.month}>
                     
                     <p className={classes.month} onClick={() => handleCashupInMonth(month.month)}>{month.month}, <span className={classes.amount}>GHC {month.totalAmount}</span>
                 </p>
                 
                     {showCashupInMonth === month.month ? <table>
                         <thead>
                             <tr>
                                 <th>Date</th>
                                 <th>Time</th>
                                 <th>Location</th>
                                 <th>Sold Tokens</th>
                                 <th>Total Amount</th>
                                 <th>Comany Share</th>
                                 <th>Balance</th>
                                 <th>Delete</th>
                             </tr>
                         </thead>
                         <tbody>
                             {month.items.map((cash) => <tr key={cash.cashupId}>
                                 <td>{cash.cashupDate}</td>
                                 <td>{cash.cashupTime}</td>
                                 <td className={classes.color}>{cash.location}</td>
                                 <td>{cash.tokensSold}</td>
                                 <td>{cash.totalSale}</td>
                                 <td className={classes.color}>{cash.companyAmount}</td>
                                 <td className={classes.balance}>{cash.balance}</td>
                                 <td><AiOutlineDelete className={classes.delete} onClick={() => deleteHandler(cash.cashupId && cash.cashupId)} /></td>
                             </tr>)}
                         </tbody>
                     </table> : ''}
                 </div>)}</div> : ''}
         </div>
     </div>)}

 </div>
 {deleteModal && <Delete assertId={assert} routeUrl="cashup" selectedId={selectedCashupId} />}
</div>:''}</>
    )
}

export default CashUpList