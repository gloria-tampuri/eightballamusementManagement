
import React,{useState,useContext, useEffect} from 'react'
import Modal from '../Modal/Modal'
import classes from './Edit.module.css'
import {AiOutlineClose} from 'react-icons/ai'
import { useRouter } from 'next/router'
import { EditContext } from '../../../Context/EditContext'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const EditModal = ({selectedId,routeUrl,assertId}) => {

  const router = useRouter()
  const [locationName, setLocationName] = useState('')
  const [numberofTokens, setNumberOfTokens] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentLocation, setCurrentLocation] = useState(false)
  const[telephoneNumber,setTelephoneNumber]=useState(0)
  const[physicalAddress, setphysicalAddress]=useState('')
  const[siteOwner,setSiteOwner]=useState('')
const[accessories, setAccessories]=useState('')
const[gpsAddress, setGpsAddress]=useState([])
const [isPickingGPS, setIsPickingGPS] = useState(false); // New state variable
const [isGpsPicked, setIsGpsPicked] = useState(false); // New state variable



  const {assert}= router.query;

  const editCtx=useContext(EditContext)

  const{hideEditModal}=editCtx

  const { data, error, isLoading } = useSWR( `/api/asserts/${assert}`,fetcher)

  const location=data?.assert?.location
  const current = location?.find((val)=>val.locationId===selectedId)
 
  const getCurrentLocation = () => {
    setIsPickingGPS(true); // Show spinner when picking GPS
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Retrieve latitude and longitude from the position object
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // Use latitude and longitude to fetch address or other location details
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);
          setGpsAddress([latitude, longitude]);
          setIsPickingGPS(false); // Hide spinner after picking GPS
        },
        (error) => {
          setIsPickingGPS(false); // Hide spinner if there's an error
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      setIsPickingGPS(false); // Hide spinner if geolocation is not supported
      console.log("Geolocation is not supported by this browser.");
    }
  };
    
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
        setAccessories(current.accessories)
        setGpsAddress(current.gpsAddress)
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
    physicalAddress,
    accessories,
    gpsAddress
}

 const response = await fetch(`/api/asserts/${assertId}/location/${selectedId}`,{
    method: 'PUT',
    headers:{
        "Content-Type":"application/json"
      },
      body: (JSON.stringify(data))
   })
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
                    <label>Table Accessories </label>
                    <input type='text'
                        placeholder='Input all accessories'
                        value={accessories}
                        onChange={(e) => { setAccessories(e.target.value) }}
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
                <div
            className={classes.pickgps}
            onClick={getCurrentLocation}
            style={{ cursor: isPickingGPS ? "not-allowed" : "pointer" }}
          >
            {isPickingGPS ? "Picking GPS..." : isGpsPicked ? "Picked" : "Pick GPS of Site"}
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