import React, { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from "./Location.module.css";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../ui/dialog/dialog";
import { IoMdAdd } from "react-icons/io";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const LocationDialog = () => {
  const router = useRouter();
  const { assert } = router.query;
  const [formData, setFormData] = useState({
    locationName: "",
    telephoneNumber: "",
    physicalAddress: "",
    siteOwner: "",
    numberofTokens: "",
    accessories: "",
    startDate: "",
    endDate: "",
    currentLocation: false
  });
  const [isPickingGPS, setIsPickingGPS] = useState(false);
  const [isGpsPicked, setIsGpsPicked] = useState(false);
  const [gpsAddress, setGpsAddress] = useState([]);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.locationName || formData.locationName.length < 2) {
      newErrors.locationName = 'Site name must be at least 2 characters';
    }
    
    if (!formData.telephoneNumber || !/^\d+$/.test(formData.telephoneNumber)) {
      newErrors.telephoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.physicalAddress) {
      newErrors.physicalAddress = 'Please input physical address';
    }
    
    if (!formData.siteOwner) {
      newErrors.siteOwner = 'Please input site owner name';
    }
    
    if (!formData.numberofTokens || isNaN(formData.numberofTokens)) {
      newErrors.numberofTokens = 'Please enter a valid number';
    }
    
    if (!formData.accessories) {
      newErrors.accessories = 'Please list accessories';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Please select start date';
    }
    
    if (!isCurrentLocation && !formData.endDate) {
      newErrors.endDate = 'Please select end date';
    }
    
    if (formData.endDate && formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCurrentLocation = () => {
    if (isPickingGPS) return;
    
    setIsPickingGPS(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGpsAddress([latitude, longitude]);
          setIsGpsPicked(true);
          setIsPickingGPS(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsPickingGPS(false);
          setErrors(prev => ({
            ...prev,
            gps: `Failed to get location: ${error.message}`
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setErrors(prev => ({
        ...prev,
        gps: 'Geolocation is not supported by your browser'
      }));
      setIsPickingGPS(false);
    }
  };

  const onFinish = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!isGpsPicked) {
      setErrors(prev => ({
        ...prev,
        gps: 'Please capture GPS coordinates before submitting'
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      const locationData = {
        locationId: uuidv4(),
        ...formData,
        numberofTokens: Number(formData.numberofTokens),
        telephoneNumber: Number(formData.telephoneNumber),
        currentLocation: isCurrentLocation,
        gpsAddress,
        createdAt: new Date().toISOString(),
      };

      const postData = {
        ...data.assert,
        location: [...(data.assert.location || []), locationData],
      };

      const response = await fetch(`/api/asserts/${assert}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save location");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors(prev => ({
        ...prev,
        form: error.message || "Failed to save location. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      locationName: "",
      telephoneNumber: "",
      physicalAddress: "",
      siteOwner: "",
      numberofTokens: "",
      accessories: "",
      startDate: "",
      endDate: "",
      currentLocation: false
    });
    setGpsAddress([]);
    setIsGpsPicked(false);
    setIsCurrentLocation(false);
    setErrors({});
  };

  const handleCurrentLocationChange = (e) => {
    setIsCurrentLocation(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({ ...prev, endDate: "" }));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorText}>
        Error loading asset data. Please try again.
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={styles.addButton}>
          <IoMdAdd className={styles.addIcon} />
          Add New Location
        </button>
      </DialogTrigger>

      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new location for this asset.
          </DialogDescription>
        </DialogHeader>

        {errors.form && (
          <div className={styles.formError}>
            {errors.form}
          </div>
        )}

        <form onSubmit={onFinish} className={styles.form}>
          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="locationName">Site Name *</label>
                <input
                  id="locationName"
                  name="locationName"
                  type="text"
                  placeholder="Enter site name"
                  value={formData.locationName}
                  onChange={handleInputChange}
                  className={errors.locationName ? styles.inputError : ''}
                />
                {errors.locationName && (
                  <div className={styles.errorMessage}>{errors.locationName}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="telephoneNumber">Telephone Number *</label>
                <input
                  id="telephoneNumber"
                  name="telephoneNumber"
                  type="tel"
                  placeholder="Enter telephone number"
                  value={formData.telephoneNumber}
                  onChange={handleInputChange}
                  className={errors.telephoneNumber ? styles.inputError : ''}
                />
                {errors.telephoneNumber && (
                  <div className={styles.errorMessage}>{errors.telephoneNumber}</div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label htmlFor="physicalAddress">Physical Address *</label>
              <textarea
                id="physicalAddress"
                name="physicalAddress"
                rows="3"
                placeholder="Enter complete physical address including city, state, and postal code"
                value={formData.physicalAddress}
                onChange={handleInputChange}
                className={errors.physicalAddress ? styles.inputError : ''}
              />
              {errors.physicalAddress && (
                <div className={styles.errorMessage}>{errors.physicalAddress}</div>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="siteOwner">Site Owner *</label>
                <input
                  id="siteOwner"
                  name="siteOwner"
                  type="text"
                  placeholder="Enter owner's full name"
                  value={formData.siteOwner}
                  onChange={handleInputChange}
                  className={errors.siteOwner ? styles.inputError : ''}
                />
                {errors.siteOwner && (
                  <div className={styles.errorMessage}>{errors.siteOwner}</div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="numberofTokens">Number of Tokens *</label>
                <input
                  id="numberofTokens"
                  name="numberofTokens"
                  type="number"
                  placeholder="Enter token count"
                  value={formData.numberofTokens}
                  onChange={handleInputChange}
                  min="1"
                  className={errors.numberofTokens ? styles.inputError : ''}
                />
                {errors.numberofTokens && (
                  <div className={styles.errorMessage}>{errors.numberofTokens}</div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label htmlFor="accessories">Table Accessories *</label>
              <textarea
                id="accessories"
                name="accessories"
                rows="3"
                placeholder="List all table accessories (e.g., chairs, umbrellas, etc.)"
                value={formData.accessories}
                onChange={handleInputChange}
                className={errors.accessories ? styles.inputError : ''}
              />
              {errors.accessories && (
                <div className={styles.errorMessage}>{errors.accessories}</div>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startDate">Start Date *</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={errors.startDate ? styles.inputError : ''}
                />
                {errors.startDate && (
                  <div className={styles.errorMessage}>{errors.startDate}</div>
                )}
              </div>

              {!isCurrentLocation && (
                <div className={styles.formGroup}>
                  <label htmlFor="endDate">End Date *</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate}
                    className={errors.endDate ? styles.inputError : ''}
                  />
                  {errors.endDate && (
                    <div className={styles.errorMessage}>{errors.endDate}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="currentLocation"
                  checked={isCurrentLocation}
                  onChange={handleCurrentLocationChange}
                />
                This is the current active location
              </label>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isPickingGPS}
              className={`${styles.gpsButton} ${isGpsPicked ? styles.gpsButtonCaptured : ''}`}
            >
              {isPickingGPS ? (
                'Getting location...'
              ) : isGpsPicked ? (
                <>
                  <FaMapMarkerAlt className={styles.gpsIcon} /> 
                  Location Captured ({gpsAddress[0]?.toFixed(6)}, {gpsAddress[1]?.toFixed(6)})
                </>
              ) : (
                'Capture GPS Coordinates'
              )}
            </button>
            {errors.gps && (
              <div className={styles.errorMessage}>{errors.gps}</div>
            )}
          </div>

          <div className={styles.formFooter}>
            <DialogClose asChild>
              <button
                type="button"
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="submit"
              disabled={!isGpsPicked || isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Adding Location...' : 'Add Location'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;