
import React,{useState,useContext, useEffect} from 'react'
import Modal from '../Modal/Modal'
import classes from './Edit.module.css'
import {AiOutlineClose} from 'react-icons/ai'
import { useRouter } from 'next/router'
import { EditContext } from '../../../Context/EditContext'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const EditModal = ({selectedId,routeUrl,assertId}) => {
console.log(selectedId && selectedId);

  const router = useRouter()
  const [locationName, setLocationName] = useState('')
  const [numberofTokens, setNumberOfTokens] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentLocation, setCurrentLocation] = useState(false)
  const[telephoneNumber,setTelephoneNumber]=useState(0)
  const[physicalAddress, setphysicalAddress]=useState('')
  const[siteOwner,setSiteOwner]=useState('')



  const {assert}= router.query;

  const editCtx=useContext(EditContext)

  const{hideEditModal}=editCtx

  const { data, error, isLoading } = useSWR( `/api/asserts/${assert}`,fetcher)
  console.log(selectedId);

  const location=data?.assert?.location
  const current = location?.find((val)=>val.locationId===selectedId)
  console.log(current?.locationName);
  console.log(current);
    
  useEffect(()=>{
    if(assert){
        setLocationName(current.locationName)
        setNumberOfTokens(current.numberofTokens)
        setStartDate(current.startDate)
        setEndDate(current.endDate)
        setCurrentLocation(currentLocation)
        setTelephoneNumber(current.telephoneNumber)
        setSiteOwner(current.siteOwner)
        setphysicalAddress(current.physicalAddress)
    }
  },[assert])

  const onSubmitHandler=async(e)=>{
  e.preventDefault()
const data={
    locationId:selectedId,
    locationName,
    numberofTokens,
    startDate,
    endDate,
    currentLocation,
    telephoneNumber,
    siteOwner,
    physicalAddress
}

 const response = await fetch(`/api/asserts/${assertId}/location/${selectedId}`,{
    method: 'PUT',
    headers:{
        "Content-Type":"application/json"
      },
      body: (JSON.stringify(data))
   })
    console.log(response);
    if(response.ok){
        hideEditModal()
    }

  }
 
  return (
    <Modal>
       <div className={classes.loca}>
       <div className={classes.close}><AiOutlineClose onClick={hideEditModal} className={classes.closeIcon}/></div>
        <form onSubmit={onSubmitHandler}>
                <div className={classes.section}>
                    <label>Site Name</label>
                    <input type='text'
                        placeholder='Site Name'
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                    />
                </div>

                <div className={classes.section}>
                    <label>Telephone Number</label>
                    <input type='number'
                        placeholder='Tel Number'
                        value={telephoneNumber}
                        onChange={(e) => setTelephoneNumber(e.target.value)}
                    />
                </div>

                <div className={classes.section}>
                    <label>Physical Address</label>
                    <input type='text'
                        placeholder='Physical Address'
                        value={physicalAddress}
                        onChange={(e) => setphysicalAddress(e.target.value)}
                    />
                </div>

                <div className={classes.section}>
                    <label>Name of Site Owner</label>
                    <input type='text'
                        placeholder='Name of Site Owner'
                        value={siteOwner}
                        onChange={(e) => setSiteOwner(e.target.value)}
                    />
                </div>

                <div className={classes.section}>
                    <label>Number of Tokens</label>
                    <input type='number'
                        placeholder='Number of Tokens given to site'
                        value={numberofTokens}
                        onChange={(e) => { setNumberOfTokens(e.target.value) }}
                    />
                </div>
                <div className={classes.section}>
                    <label>Commence Date</label>
                    <input type='date'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className={classes.current}>
                    <label>This is the current Location</label>
                    <input type='checkbox'
                        value={currentLocation}
                        onChange={() => setCurrentLocation(!currentLocation)}
                    />
                </div>

                {!currentLocation && <div className={classes.section}>
                    <label>End Date</label>
                    <input type='date'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>}
                <button>Submit</button>
            </form>
       </div>
    </Modal>
  )
}

export default EditModal