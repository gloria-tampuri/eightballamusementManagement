import React, { useState, useContext, useEffect } from 'react'
import Modal from '../Modal/Modal'
import classes from './Edit.module.css'
import { AiOutlineClose } from 'react-icons/ai'
import { useRouter } from 'next/router'
import { EditContext } from '../../../Context/EditContext'
import useSWR from 'swr'
import { FaMapMarkerAlt } from 'react-icons/fa'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const EditModal = ({ selectedId, routeUrl, assertId }) => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    locationName: '',
    numberofTokens: 0,
    startDate: '',
    endDate: '',
    telephoneNumber: 0,
    physicalAddress: '',
    siteOwner: '',
    accessories: '',
  })
  const [currentLocation, setCurrentLocation] = useState(false)
  const [gpsAddress, setGpsAddress] = useState([])
  const [isPickingGPS, setIsPickingGPS] = useState(false)
  const [isGpsPicked, setIsGpsPicked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const { assert } = router.query
  const editCtx = useContext(EditContext)
  const { hideEditModal } = editCtx

  const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher)
  const location = data?.assert?.location
  const current = location?.find((val) => val.locationId === selectedId)

  const getCurrentLocation = () => {
    if (isPickingGPS) return

    setIsPickingGPS(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          setGpsAddress([latitude, longitude])
          setIsGpsPicked(true)
          setIsPickingGPS(false)
        },
        (error) => {
          setIsPickingGPS(false)
          console.error("Error getting location:", error.message)
          setErrors(prev => ({ ...prev, gps: "Failed to get location" }))
        }
      )
    } else {
      setIsPickingGPS(false)
      setErrors(prev => ({ ...prev, gps: "Geolocation not supported" }))
    }
  }

  useEffect(() => {
    if (assert && current) {
      setFormData({
        locationName: current.locationName || '',
        numberofTokens: current.numberofTokens || 0,
        startDate: current.startDate || '',
        endDate: current.endDate || '',
        telephoneNumber: current.telephoneNumber || 0,
        physicalAddress: current.physicalAddress || '',
        siteOwner: current.siteOwner || '',
        accessories: current.accessories || '',
      })
      setCurrentLocation(current.currentLocation || false)
      setGpsAddress(current.gpsAddress || [])
      setIsGpsPicked(!!current.gpsAddress)
    }
  }, [assert, current])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCurrentLocationChange = (e) => {
    const isChecked = e.target.checked
    setCurrentLocation(isChecked)
    if (isChecked) {
      setFormData(prev => ({ ...prev, endDate: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.locationName) newErrors.locationName = 'Site name is required'
    if (!formData.telephoneNumber) newErrors.telephoneNumber = 'Telephone number is required'
    if (!formData.physicalAddress) newErrors.physicalAddress = 'Physical address is required'
    if (!formData.siteOwner) newErrors.siteOwner = 'Site owner is required'
    if (!formData.numberofTokens) newErrors.numberofTokens = 'Number of tokens is required'
    if (!formData.accessories) newErrors.accessories = 'Accessories are required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!currentLocation && !formData.endDate) newErrors.endDate = 'End date is required'
    if (!isGpsPicked) newErrors.gps = 'GPS coordinates are required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const data = {
        locationId: selectedId,
        ...formData,
        numberofTokens: Number(formData.numberofTokens),
        telephoneNumber: Number(formData.telephoneNumber),
        currentLocation,
        gpsAddress,
      }

      const response = await fetch(`/api/asserts/${assertId}/location/${selectedId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        hideEditModal()
      } else {
        throw new Error('Failed to update location')
      }
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal>
      <div className={classes.modalContainer}>
        <div className={classes.modalHeader}>
          <h2 className={classes.modalTitle}>Edit Location</h2>
          <button onClick={hideEditModal} className={classes.closeButton}>
            <AiOutlineClose />
          </button>
        </div>

        <form onSubmit={onSubmitHandler} className={classes.form}>
          <div className={classes.formSection}>
            <div className={classes.formRow}>
              <div className={classes.formGroup}>
                <label htmlFor="locationName">Site Name *</label>
                <input
                  id="locationName"
                  name="locationName"
                  type="text"
                  placeholder="Enter site name"
                  value={formData.locationName}
                  onChange={handleInputChange}
                  className={errors.locationName ? classes.inputError : ''}
                />
                {errors.locationName && (
                  <div className={classes.errorMessage}>{errors.locationName}</div>
                )}
              </div>

              <div className={classes.formGroup}>
                <label htmlFor="telephoneNumber">Telephone Number *</label>
                <input
                  id="telephoneNumber"
                  name="telephoneNumber"
                  type="tel"
                  placeholder="Enter telephone number"
                  value={formData.telephoneNumber}
                  onChange={handleInputChange}
                  className={errors.telephoneNumber ? classes.inputError : ''}
                />
                {errors.telephoneNumber && (
                  <div className={classes.errorMessage}>{errors.telephoneNumber}</div>
                )}
              </div>
            </div>
          </div>

          <div className={classes.formSection}>
            <div className={classes.formGroup}>
              <label htmlFor="physicalAddress">Physical Address *</label>
              <textarea
                id="physicalAddress"
                name="physicalAddress"
                rows="3"
                placeholder="Enter complete physical address"
                value={formData.physicalAddress}
                onChange={handleInputChange}
                className={errors.physicalAddress ? classes.inputError : ''}
              />
              {errors.physicalAddress && (
                <div className={classes.errorMessage}>{errors.physicalAddress}</div>
              )}
            </div>
          </div>

          <div className={classes.formSection}>
            <div className={classes.formRow}>
              <div className={classes.formGroup}>
                <label htmlFor="siteOwner">Site Owner *</label>
                <input
                  id="siteOwner"
                  name="siteOwner"
                  type="text"
                  placeholder="Enter owner's full name"
                  value={formData.siteOwner}
                  onChange={handleInputChange}
                  className={errors.siteOwner ? classes.inputError : ''}
                />
                {errors.siteOwner && (
                  <div className={classes.errorMessage}>{errors.siteOwner}</div>
                )}
              </div>

              <div className={classes.formGroup}>
                <label htmlFor="numberofTokens">Number of Tokens *</label>
                <input
                  id="numberofTokens"
                  name="numberofTokens"
                  type="number"
                  placeholder="Enter token count"
                  value={formData.numberofTokens}
                  onChange={handleInputChange}
                  min="1"
                  className={errors.numberofTokens ? classes.inputError : ''}
                />
                {errors.numberofTokens && (
                  <div className={classes.errorMessage}>{errors.numberofTokens}</div>
                )}
              </div>
            </div>
          </div>

          <div className={classes.formSection}>
            <div className={classes.formGroup}>
              <label htmlFor="accessories">Table Accessories *</label>
              <textarea
                id="accessories"
                name="accessories"
                rows="3"
                placeholder="List all table accessories"
                value={formData.accessories}
                onChange={handleInputChange}
                className={errors.accessories ? classes.inputError : ''}
              />
              {errors.accessories && (
                <div className={classes.errorMessage}>{errors.accessories}</div>
              )}
            </div>
          </div>

          <div className={classes.formSection}>
            <div className={classes.formRow}>
              <div className={classes.formGroup}>
                <label htmlFor="startDate">Start Date *</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={errors.startDate ? classes.inputError : ''}
                />
                {errors.startDate && (
                  <div className={classes.errorMessage}>{errors.startDate}</div>
                )}
              </div>

              {!currentLocation && (
                <div className={classes.formGroup}>
                  <label htmlFor="endDate">End Date *</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    min={formData.startDate}
                    className={errors.endDate ? classes.inputError : ''}
                  />
                  {errors.endDate && (
                    <div className={classes.errorMessage}>{errors.endDate}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={classes.formSection}>
            <div className={classes.formGroup}>
              <label className={classes.checkboxLabel}>
                <input
                  type="checkbox"
                  name="currentLocation"
                  checked={currentLocation}
                  onChange={handleCurrentLocationChange}
                />
                This is the current active location
              </label>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isPickingGPS}
              className={`${classes.gpsButton} ${isGpsPicked ? classes.gpsButtonCaptured : ''}`}
            >
              {isPickingGPS ? (
                'Getting location...'
              ) : isGpsPicked ? (
                <>
                  <FaMapMarkerAlt className={classes.gpsIcon} /> 
                  Location Captured ({gpsAddress[0]?.toFixed(6)}, {gpsAddress[1]?.toFixed(6)})
                </>
              ) : (
                'Capture GPS Coordinates'
              )}
            </button>
            {errors.gps && (
              <div className={classes.errorMessage}>{errors.gps}</div>
            )}
          </div>

          <div className={classes.formFooter}>
            <button
              type="button"
              onClick={hideEditModal}
              className={classes.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isGpsPicked || isSubmitting}
              className={classes.submitButton}
            >
              {isSubmitting ? 'Updating...' : 'Update Location'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default EditModal