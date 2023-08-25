import React,{useState}from 'react'
import classes from './CashupModal.module.css'
import Modal from '../Modal/Modal'
import { AiOutlineClose } from 'react-icons/ai'

const CashupModal = () => {
const[closeModal,setCloseModal]=useState(true)

const handleCloseModal=()=>{
    setCloseModal(!closeModal)
}
  return (
  <>
  { closeModal && <Modal>
          <div className={classes.close}><AiOutlineClose onClick={handleCloseModal} className={classes.closeIcon}/></div>
        <h1>Hello</h1>
    </Modal>}
  </>
  )
}

export default CashupModal