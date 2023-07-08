import React, { useContext, useEffect, useState } from 'react'
import classes from './List.module.css'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import Delete from '../Delete/Delete'
import { DeleteContext } from '../../../Context/DeleteContext'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
// import { format } from 'date-fns'

// format(new Date(2014, 1, 11), 'MM/dd/yyyy')

const fetcher = (...args) => fetch(...args).then(res => res.json())

const CashUpList = () => {
    const router = useRouter()
    const { assert } = router.query
    const deleteCtx = useContext(DeleteContext)
    const { showDeleteModal, deleteModal } = deleteCtx
    const [selectedCashupId, setSelectedCashupId] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [showMonths, setShowMonths] = useState(false)
    const [showCashupInMonth, setShowCashupInMonth] = useState(null)
    const [totalRevenue, setTotalRevenue] = useState(0)

    const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher)


    const [allProducts, setAllProducts] = useState(() => data?.assert?.cashup)
    const [filteredCashup, setFilteredCashup] = useState()

    console.log(filteredCashup);

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

    const handleSelect = (date) => {

        let filter = allProducts?.filter((assert) => {
            let cashupDate = new Date(assert["date"])
            return (
                cashupDate >= date.selection.startDate &&
                cashupDate <= date.selection.endDate
            )
        })



        // setStartDate(date.selection.startDate)
        // setEndDate(date.selection.endDate)
        setFilteredCashup(filter)
    }


    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const groupedDataByYear = data?.assert?.cashup.reduce((result, cash) => {
        const date = new Date(cash.date)
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
          const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.companyAmount), 0);
          const formattedAmount = parseFloat(totalAmount.toFixed(2));
          return { month, items, totalAmount: formattedAmount };
        });
        const totalAmount = monthsWithAmounts.reduce((sum, { totalAmount }) => sum + (typeof totalAmount === 'number' ? totalAmount : 0), 0);
        const formattedTotalAmount = parseFloat(totalAmount.toFixed(2));
        return { year, months: monthsWithAmounts, totalAmount: formattedTotalAmount };
      });
      
      
      
console.log(groupedDataArrayWithAmounts);      



    const handleMonths = (year) => {
        setShowMonths(showMonths === year ? undefined : year)

        console.log(year);
    }
    const handleCashupInMonth = (month) => {

        setShowCashupInMonth(showCashupInMonth === month ? undefined : month)

    }

    


    
    

    useEffect(() => {
        const totalRevenue = data?.assert?.cashup?.map(cashup => +cashup.companyAmount).reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
        )
        setTotalRevenue(totalRevenue)
    }, [data])







    return (
        <div>
            <h2>Total Revenue of Table: <span>{totalRevenue}</span></h2>

            <div className={classes.list}>

                {groupedDataArrayWithAmounts.map((list) => <div>
                    <div>
                        <h1 className={classes.years} onClick={() => handleMonths(list.year)}>{list.year}, <span className={classes.amount}> GHC {list.totalAmount}</span></h1>

                        {showMonths === list.year ? <div>{list.months.map((month) =>
                            <div><p className={classes.month} onClick={() => handleCashupInMonth(month.month)}>{month.month}, <span className={classes.amount}>GHC {month.totalAmount}</span>
                            </p>
                            
                                {showCashupInMonth === month.month ? <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Location</th>
                                            <th>Tokens Played</th>
                                            <th>Percentage</th>
                                            <th>Total Amount</th>
                                            <th>Site Amount</th>
                                            <th>Comany Amount</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {month.items.map((cash) => <tr key={cash.cashupId}>
                                            <td>{cash.date}</td>
                                            <td>{cash.location}</td>
                                            <td>{cash.numberOfTokensPlayed}</td>
                                            <td>{cash.percentage}</td>
                                            <td>{cash.totalAmount}</td>
                                            <td>{cash.siteAmount}</td>
                                            <td>{cash.companyAmount}</td>
                                            <td><AiOutlineDelete onClick={() => deleteHandler(cash.cashupId && cash.cashupId)} /></td>
                                        </tr>)}
                                    </tbody>
                                </table> : ''}
                            </div>)}</div> : ''}
                    </div>
                </div>)}

            </div>
            {deleteModal && <Delete assertId={assert} routeUrl="cashup" selectedId={selectedCashupId} />}
        </div>
    )
}

export default CashUpList