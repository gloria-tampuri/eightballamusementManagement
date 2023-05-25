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
    const {assert}=router.query
    const deleteCtx = useContext(DeleteContext)
    const { showDeleteModal, deleteModal } = deleteCtx
    const [selectedCashupId, setSelectedCashupId] = useState()
    const[startDate, setStartDate]=useState()
    const[endDate, setEndDate]=useState()

    const { data, error, isLoading } = useSWR( `/api/asserts/${assert}`,fetcher)
    
   
    const[allProducts,setAllProducts]=useState(() => data?.assert?.cashup)
    const [filteredCashup, setFilteredCashup]  = useState()

console.log(filteredCashup);

    useEffect(() => {
        if(data?.status === 200){
        setAllProducts(data?.assert?.cashup)
        }
       
    }, [data]);

    useEffect(() => {
        const data =  allProducts && allProducts
        setFilteredCashup(data)
    }, [allProducts]);

    const deleteHandler = (id) => {
        setSelectedCashupId(id);
        showDeleteModal()
    }

    const handleSelect=(date)=>{

        let filter =allProducts?.filter((assert)=>{
            let cashupDate =  new Date(assert["date"])
            return(
                cashupDate>=date.selection.startDate &&
                cashupDate<=date.selection.endDate
            )
        })
    

       
        // setStartDate(date.selection.startDate)
        // setEndDate(date.selection.endDate)
        setFilteredCashup(filter)
    }

    
    const selectionRange = {
        startDate:startDate,
        endDate: endDate,
        key: 'selection',
        
    }

    return (
        <div>
            <DateRangePicker
                ranges={[selectionRange]}
                onChange={handleSelect}
            />

            <div className={classes.list}>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Tokens Played</th>
                            <th>Percentage</th>
                            <th>Total Amount</th>
                            <th>Site Amount</th>
                            <th>Comany Amount</th>
                            <th>Delete</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCashup?.map((cash) => <tr key={cash.cashupId}>
                            <td>{cash.date}</td>
                            <td>{cash.numberOfTokensPlayed}</td>
                            <td>{cash.percentage}</td>
                            <td>{cash.totalAmount}</td>
                            <td>{cash.siteAmount}</td>
                            <td>{cash.companyAmount}</td>
                            <td><AiOutlineDelete onClick={() => deleteHandler(cash.cashupId && cash.cashupId)} /></td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            {deleteModal && <Delete assertId={assert} routeUrl="cashup" selectedId={selectedCashupId} />}
        </div>
    )
}

export default CashUpList