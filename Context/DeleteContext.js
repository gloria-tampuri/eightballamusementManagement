import React from 'react'
import { createContext, useState } from 'react'

export const DeleteContext = createContext(null);

export const DeleteContextProvider = ({ children }) => {
    const [deleteModal, setDeleteModal] = useState(false)

    const showDeleteModal = () => {
        setDeleteModal(true)
    }

    const hideDeleteModal = () => {
        setDeleteModal(false)
    }
    return (
        <DeleteContext.Provider value={{ deleteModal, showDeleteModal, hideDeleteModal }}>
            {children}
        </DeleteContext.Provider>
    )
}