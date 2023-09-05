import React,{useContext} from 'react'
import Modal from '../Modal/Modal'
import classes from './Delete.module.css'
import {AiOutlineClose} from 'react-icons/ai'
import { useRouter } from 'next/router'
import { DeleteContext } from '../../../Context/DeleteContext'

const Delete = ({selectedId,routeUrl,assertId}) => {
 
  const router = useRouter()
  
 const {assert} = router.query

    const deleteCtx=useContext(DeleteContext)
    const{ hideDeleteModal}=deleteCtx
    const deleteCashupHandler = async () =>{
      // Perform our delete logic here

      //  await fetch(`/api/asserts/${assertId}/${routeUrl}/${selectedId}`,{
      //     method: 'PATCH'
      //    })
      await fetch(`/api/asserts/${assertId}/${routeUrl}/${selectedId}`,{
        method: 'PATCH'
        
       })
       hideDeleteModal()
    }
  return (
    <Modal> 
        <div className={classes.close}><AiOutlineClose onClick={hideDeleteModal} className={classes.closeIcon}/></div>
   <p className={classes.header}> Are you sure you want to delete entry     ?</p>

    <div className={classes.actions}>
        <div className={classes.actions1} onClick={deleteCashupHandler}>Delete</div>
        <div className={classes.actions2} onClick={hideDeleteModal}>Cancel</div>
    </div>

    </Modal>
  )
}

export default Delete