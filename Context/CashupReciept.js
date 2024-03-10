import React from 'react'
import { createContext, useState } from 'react'

export const ReceiptContext = createContext(null);

export const ReceiptContextProvider=({children})=>{
        const [receiptModal, setReceiptModal]=useState(false)
        const [receiptData, setReceiptData] = useState(null);


        const showReceiptModal=(cashData)=>{
            setReceiptModal(true)
            setReceiptData(cashData)
        }

        const hideReceiptModal=()=>{
            setReceiptModal(false)
            setReceiptData(null)
        }

        return (
            <ReceiptContext.Provider value={{ receiptModal, showReceiptModal, hideReceiptModal,receiptData,setReceiptData}}>
                {children}
            </ReceiptContext.Provider>
        )
}