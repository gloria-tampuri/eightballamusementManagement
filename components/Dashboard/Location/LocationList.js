import React,{useContext, useState} from 'react'
import classes from './List.module.css'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import Delete from '../Delete/Delete'
import { DeleteContext } from '../../../Context/DeleteContext'

const fetcher = (...args) => fetch(...args).then(res => res.json())


const LocationList = () => {
  const router = useRouter()
  const {assert}=router.query
  const deleteCtx = useContext(DeleteContext)
  const{showDeleteModal,deleteModal}=deleteCtx
  const [selectedLocationId, setSelectedLocationId] = useState()

    const { data, error } = useSWR(`/api/asserts/${assert}`, fetcher,{refreshInterval: 1000})
    
    const deleteHandler = (id) =>{
        setSelectedLocationId(id);
        showDeleteModal()
      }

  return (
    <div className={classes.list}>
      <table>
        <thead>
          <tr>
            <th>Location Name</th>
            <th>Tokens Given</th>
            <th>Start date</th>
            <th>End date</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
            {data && data?.assert?.location.map((site)=><tr td={site.locationId}>
            <td>{site.locationName}</td>
            <td>{site.numberofTokens}</td>
            <td>{site.startDate}</td>
            <td>{site.endDate===''? 'current Location': site.endDate}</td>
            <td><AiOutlineDelete onClick={()=>deleteHandler(site.locationId && site.locationId)} /></td>
            </tr>)}
        </tbody>
      </table>
      {deleteModal && <Delete  assertId={assert} routeUrl="location" selectedId={selectedLocationId}/>}
    </div>
  )
}

export default LocationList