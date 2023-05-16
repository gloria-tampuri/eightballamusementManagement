import React,{useContext, useState} from 'react'
import classes from './List.module.css'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import Delete from '../Delete/Delete'
import { DeleteContext } from '../../../Context/DeleteContext'


const fetcher = (...args) => fetch(...args).then(res => res.json())

const CashUpList = () => {
    const router = useRouter()
  const {assert}=router.query
  const deleteCtx = useContext(DeleteContext)
  const{showDeleteModal,deleteModal}=deleteCtx
  const [selectedCashupId, setSelectedCashupId] = useState()

    const { data, error } = useSWR(`/api/asserts/${assert}`, fetcher,{refreshInterval: 1000})
    
    const deleteHandler = (id) =>{
        setSelectedCashupId(id);
        showDeleteModal()
      }

    return (
        <div>
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
            {data && data?.assert?.cashup.map((cash)=><tr key={cash.cashupId}>
            <td>{cash.date}</td>
            <td>{cash.numberOfTokensPlayed}</td>
            <td>{cash.percentage}</td>
            <td>{cash.totalAmount}</td>
            <td>{cash.siteAmount}</td>
            <td>{cash.companyAmount}</td>
            <td><AiOutlineDelete onClick={()=>deleteHandler(cash.cashupId && cash.cashupId)} /></td>
            </tr>)}
         </tbody>
            </table>
            </div>
            {deleteModal && <Delete  assertId={assert} routeUrl="cashup" selectedId={selectedCashupId}/>}
        </div>
    )
}

export default CashUpList