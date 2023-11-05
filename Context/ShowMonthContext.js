import React from 'react'
import { createContext, useState,useContext } from 'react'

export const ShowMonthContext = createContext(null);

export const ShowMonthContextProvider=({children})=>{
    const [showMonth, setShowMonth]=useState(false)
    const handleShowMonth=()=>{
        setShowMonth(true)
    }
    const handleHideMonth=()=>{
        setShowMonth(false)
    }

    return(

        <ShowMonthContext.Provider value={{handleShowMonth, handleHideMonth, showMonth}}>
            {children}
        </ShowMonthContext.Provider>
    )
}

// import React, { createContext, useContext, useState } from 'react';

const MonthContext = createContext();

export function MonthContextProvider({ children }) {
  const [selectedYear, setSelectedYear] = useState(0); // Initialize with a default value
  const [selectedMonth, setSelectedMonth] = useState(0); // Initialize with a default value

  return (
    <MonthContext.Provider value={{ selectedYear, setSelectedYear, selectedMonth, setSelectedMonth }}>
      {children}
    </MonthContext.Provider>
  );
}

export function useMonthContext() {
  return useContext(MonthContext);
}
