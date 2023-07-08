import React from 'react'
import { createContext, useState } from 'react'

export const EditContext = createContext(null);

export const EditContextProvider=({children})=>{
        const [editModal, setEditModal]=useState(false)

        const showEditModal=()=>{
            setEditModal(true)
        }

        const hideEditModal=()=>{
            setEditModal(false)
        }

        return (
            <EditContext.Provider value={{ editModal, showEditModal, hideEditModal }}>
                {children}
            </EditContext.Provider>
        )
}

