import React, { useState } from "react";
import classes from "./Location.module.css";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import LocationList from "./LocationList";
import { BiArrowBack } from "react-icons/bi";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Location = () => {
  const router = useRouter();
  const { assert } = router.query;

  const [locationName, setLocationName] = useState("");
  const [numberofTokens, setNumberOfTokens] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentLocation, setCurrentLocation] = useState(false);
  const [telephoneNumber, setTelephoneNumber] = useState(0);
  const [physicalAddress, setphysicalAddress] = useState("");
  const [siteOwner, setSiteOwner] = useState("");
  const [accessories, setAccessories] = useState("");

  const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const receivedInfo = {
      locationId: uuidv4(),
      locationName: locationName,
      numberofTokens: Number(numberofTokens),
      startDate: startDate,
      endDate: endDate,
      telephoneNumber: telephoneNumber,
      physicalAddress: physicalAddress,
      siteOwner: siteOwner,
      currentLocation: currentLocation,
      accessories: accessories,
    };

    const postData = {
      assertId: data?.assert?.assertId,
      datePurchased: data?.assert?.datePurchased,
      purchasedPrice: data?.assert?.purchasedPrice,
      assertState: data?.assert?.assertState,
      createdAt: data?.assert?.createdAt,

      cashup: [...data.assert.cashup],
      expenditure: [...data.assert.expenditure],
      location: [...data.assert.location, receivedInfo],
    };

    const response = await fetch(`/api/asserts/${assert}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    if (response.ok) {
      setCurrentLocation(currentLocation), setLocationName("");
      setNumberOfTokens(0), setStartDate("");
      setEndDate("");
      setphysicalAddress("");
      setTelephoneNumber(0);
      setSiteOwner("");
      setAccessories("");
    }
  };

  return (
    <div className={classes.location}>
      <div className={classes.back} onClick={() => router.back()}>
        {" "}
        <BiArrowBack />
        Back
      </div>
      <h2> Locations for {data?.assert?.assertId}</h2>
      <div className="no-print">
        <form onSubmit={onSubmitHandler}>
          <div className={classes.section}>
            <label>Site Name</label>
            <input
              type="text"
              placeholder="Site Name"
              value={locationName}
              required
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>

          <div className={classes.section}>
            <label>Telephone Number</label>
            <input
              type="number"
              placeholder="Tel Number"
              value={telephoneNumber}
              required
              onChange={(e) => setTelephoneNumber(e.target.value)}
            />
          </div>

          <div className={classes.section}>
            <label>Physical Address</label>
            <input
              type="text"
              placeholder="Physical Address"
              value={physicalAddress}
              required
              onChange={(e) => setphysicalAddress(e.target.value)}
            />
          </div>

          <div className={classes.section}>
            <label>Name of Site Owner</label>
            <input
              type="text"
              placeholder="Name of Site Owner"
              value={siteOwner}
              onChange={(e) => setSiteOwner(e.target.value)}
              required
            />
          </div>

          <div className={classes.section}>
            <label>Number of Tokens</label>
            <input
              type="number"
              placeholder="Number of Tokens given to site"
              value={numberofTokens}
              required
              onChange={(e) => {
                setNumberOfTokens(e.target.value);
              }}
            />
          </div>
          <div className={classes.section}>
            <label>Table Accessories </label>
            <input
              type="text"
              placeholder="Input all accessories"
              value={accessories}
              onChange={(e) => {
                setAccessories(e.target.value);
              }}
              required
            />
          </div>
          <div className={classes.section}>
            <label>Commence Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className={classes.current}>
            <label>This is the current Location</label>
            <input
              type="checkbox"
              value={currentLocation}
              onChange={() => setCurrentLocation(!currentLocation)}
            />
          </div>

          {!currentLocation && (
            <div className={`${classes.section} ${classes.end}`}>
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
          <button>Submit</button>
        </form>
      </div>
      <LocationList />
    </div>
  );
};

export default Location;
