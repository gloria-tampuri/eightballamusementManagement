// import React, { useContext } from 'react'
// import { createContext, useState } from 'react'
// import useSWR from 'swr'


// export const AssetDataContext = createContext(null);
// const fetcher = (...args) => fetch(...args).then(res => res.json())
// export const useAssertData = () => useContext(AssetDataContext);

// export const AssetDataContextProvider=({children})=>{
//     const { data, error, isLoading } = useSWR('/api/asserts', fetcher)
//     const[assetData, setAssetData]=useState([data])



//     return(
//         <AssetDataContext.Provider value={{assetData}}>
//             {children}
//         </AssetDataContext.Provider>
//     )
// }

import React, { createContext, useContext, useState } from 'react';
import useSWR from 'swr';

export const AssetDataContext = createContext(null);

const fetcher = (...args) => fetch(...args).then(res => res.json());

export const useAssetData = () => useContext(AssetDataContext);

export const AssetDataContextProvider = ({ children }) => {
  const { data, error, isValidating, mutate } = useSWR('/api/asserts', fetcher);
  const assetsData = data;


  // Function to trigger a re-fetch when needed
  const refreshData = () => {
    mutate();
  };

  return (
    <AssetDataContext.Provider value={{ assetsData, refreshData, isLoading: isValidating }}>
      {children}
    </AssetDataContext.Provider>
  );
};
