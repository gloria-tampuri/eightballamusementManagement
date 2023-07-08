import React,{useContext, useState} from 'react'
import classes from './List.module.css'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'
import Delete from '../Delete/Delete'
import { DeleteContext } from '../../../Context/DeleteContext'
import { EditContext } from '../../../Context/EditContext'
import EditModal from '../EditModal/EditModal'

const fetcher = (...args) => fetch(...args).then(res => res.json())


const LocationList = () => {
  const router = useRouter()
  const {assert}=router.query
  const deleteCtx = useContext(DeleteContext)
  const editCtx=useContext(EditContext)
  const{showDeleteModal,deleteModal}=deleteCtx
  const{showEditModal, editModal}=editCtx
  const [selectedLocationId, setSelectedLocationId] = useState()
 

    const { data, error } = useSWR(`/api/asserts/${assert}`, fetcher,{refreshInterval: 1000})
    
    const deleteHandler = (id) =>{
        setSelectedLocationId(id);
        showDeleteModal()
      }

      const editHandler=(id)=>{
        setSelectedLocationId(id);
        console.log(id);
        showEditModal()
        
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {data && data?.assert?.location.map((site)=><tr key={site.locationId}>
            <td>{site.locationName}</td>
            <td>{site.numberofTokens}</td>
            <td>{site.startDate}</td>
            <td>{site.endDate===''? 'current Location': site.endDate}</td>
            <td><div className={classes.action}><AiOutlineDelete onClick={()=>deleteHandler(site.locationId && site.locationId)} /> <AiOutlineEdit onClick={()=>editHandler(site.locationId && site.locationId)}/></div></td>
            </tr>)}
        </tbody>
      </table>
      {deleteModal && <Delete  assertId={assert} routeUrl="location" selectedId={selectedLocationId}/>}
      {editModal && <EditModal  assertId={assert} routeUrl="location" selectedId={selectedLocationId}/>}

    </div>
  )
}

export default LocationList