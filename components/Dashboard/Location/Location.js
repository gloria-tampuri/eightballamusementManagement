import React, { useState } from 'react'
import classes from './Location.module.css'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr'
import LocationList from './LocationList';
import {BiArrowBack} from 'react-icons/bi'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const Location = () => {
    const router = useRouter()
    const { assert } = router.query;

    const [locationName, setLocationName] = useState('')
    const [numberofTokens, setNumberOfTokens] = useState(0)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [currentLocation, setCurrentLocation] = useState(false)

    const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher)


    const onSubmitHandler = async (e) => {
        e.preventDefault()
        const receivedInfo = {
            locationId: uuidv4(),
            locationName: locationName,
            numberofTokens: numberofTokens,
            startDate: startDate,
            endDate: endDate,
            currentLocation: currentLocation
        }
        console.log(receivedInfo);


        const postData = {
            assertId: data?.assert?.assertId,
            datePurchased: data?.assert?.datePurchased,
            purchasedPrice: data?.assert?.purchasedPrice,
            assertState: data?.assert?.assertState,
            createdAt: data?.assert?.createdAt,

            cashup: [
                ...data.assert.cashup,
            ],
            expenditure: [
                ...data.assert.expenditure,
            ],
            location: [
                ...data.assert.location,
                receivedInfo
            ]

        }

        const response = await fetch(`/api/asserts/${assert}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData)
        })
        if (response.ok) {

            setCurrentLocation(currentLocation),
                setLocationName('')
            setNumberOfTokens(0),
                setStartDate('')
            setEndDate('')

        }
    }


    return (
        <div className={classes.location}>
            <div className={classes.back} onClick={() => router.back()}>       <BiArrowBack />Back</div>
            <h2>Cash Up for {data?.assert?.assertId}</h2>
            <form onSubmit={onSubmitHandler}>
                <div className={classes.section}>
                    <label>Name of Location</label>
                    <input type='text'
                        placeholder='Location Name'
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
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
                    <label>Start Date</label>
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
            <LocationList />
        </div>
    )
}

export default Location