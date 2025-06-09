import React, { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Checkbox, 
  Spin, 
  Typography,
  message,
  Row,
  Col,
  Space
} from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import LocationList from "./LocationList";
import styles from "./Location.module.css";
import Back from "components/ui/back/back";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../ui/dialog/dialog";
import AddButton from "../../ui/button/button";
import { IoMdAdd } from "react-icons/io";

const { Text, Title } = Typography;
const { TextArea } = Input;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const LocationDialog = () => {
  const router = useRouter();
  const { assert } = router.query;
  const [form] = Form.useForm();
  const [isPickingGPS, setIsPickingGPS] = useState(false);
  const [isGpsPicked, setIsGpsPicked] = useState(false);
  const [gpsAddress, setGpsAddress] = useState([]);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher);

  const getCurrentLocation = () => {
    if (isPickingGPS) return;
    
    setIsPickingGPS(true);
    message.loading({ content: 'Getting your location...', key: 'gps' });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGpsAddress([latitude, longitude]);
          setIsGpsPicked(true);
          setIsPickingGPS(false);
          message.success({ content: 'Location captured!', key: 'gps', duration: 2 });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsPickingGPS(false);
          message.error({ 
            content: `Failed to get location: ${error.message}`, 
            key: 'gps', 
            duration: 3 
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      message.error({ 
        content: 'Geolocation is not supported by your browser', 
        key: 'gps', 
        duration: 3 
      });
      setIsPickingGPS(false);
    }
  };

  const onFinish = async (values) => {
    if (!isGpsPicked) {
      message.warning("Please capture GPS coordinates before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const locationData = {
        locationId: uuidv4(),
        ...values,
        numberofTokens: Number(values.numberofTokens),
        telephoneNumber: Number(values.telephoneNumber),
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
        message.success("Location added successfully!");
        resetForm();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save location");
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error(error.message || "Failed to save location. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setGpsAddress([]);
    setIsGpsPicked(false);
    setIsCurrentLocation(false);
  };

  const handleCurrentLocationChange = (e) => {
    setIsCurrentLocation(e.target.checked);
    if (e.target.checked) {
      form.setFieldsValue({ endDate: null });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Text type="danger" className={styles.errorText}>
          Error loading asset data. Please try again.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Row gutter={24} justify="center">
        <Col xs={24} lg={12}>
          <Dialog>
            <DialogTrigger asChild>
              <AddButton text="Add New Location" />
            </DialogTrigger>

            <DialogContent className={styles.dialogContent}>
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new location for this asset.
                </DialogDescription>
              </DialogHeader>
              <div>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ currentLocation: false }}
                className={styles.form}
                requiredMark="optional"
              >
                <div className={styles.formSection}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Site Name"
                        name="locationName"
                        rules={[
                          { required: true, message: 'Please input site name!' },
                          { min: 2, message: 'Site name must be at least 2 characters' }
                        ]}
                      >
                        <Input 
                          placeholder="Enter site name" 
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Telephone Number"
                        name="telephoneNumber"
                        rules={[
                          { required: true, message: 'Please input telephone number!' },
                          { pattern: /^\d+$/, message: 'Please enter a valid phone number' }
                        ]}
                      >
                        <Input 
                          type="tel" 
                          placeholder="Enter telephone number" 
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className={styles.formSection}>
                  <Form.Item
                    label="Physical Address"
                    name="physicalAddress"
                    rules={[{ required: true, message: 'Please input physical address!' }]}
                  >
                    <TextArea 
                      rows={3} 
                      placeholder="Enter complete physical address including city, state, and postal code"
                      showCount
                      maxLength={500}
                    />
                  </Form.Item>
                </div>

                <div className={styles.formSection}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Site Owner"
                        name="siteOwner"
                        rules={[{ required: true, message: 'Please input site owner name!' }]}
                      >
                        <Input 
                          placeholder="Enter owner's full name" 
                          size="large"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Number of Tokens"
                        name="numberofTokens"
                        rules={[
                          { required: true, message: 'Please input number of tokens!' },
                        ]}
                      >
                        <Input 
                          type="number" 
                          placeholder="Enter token count" 
                          size="large"
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>

                <div className={styles.formSection}>
                  <Form.Item
                    label="Table Accessories"
                    name="accessories"
                    rules={[{ required: true, message: 'Please list accessories!' }]}
                  >
                    <TextArea 
                      rows={3} 
                      placeholder="List all table accessories (e.g., chairs, umbrellas, etc.)"
                      showCount
                      maxLength={300}
                    />
                  </Form.Item>
                </div>

                <div className={styles.formSection}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: 'Please select start date!' }]}
                      >
                        <DatePicker 
                          placeholder="Select start date"
                          format="YYYY-MM-DD"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      {!isCurrentLocation && (
                        <Form.Item
                          label="End Date"
                          name="endDate"
                          rules={[
                            {
                              validator: (_, value) => {
                                const startDate = form.getFieldValue('startDate');
                                if (value && startDate && value.isBefore(startDate)) {
                                  return Promise.reject(new Error('End date must be after start date'));
                                }
                                return Promise.resolve();
                              }
                            }
                          ]}
                        >
                          <DatePicker 
                            placeholder="Select end date"
                            format="YYYY-MM-DD"
                            size="large"
                          />
                        </Form.Item>
                      )}
                    </Col>
                  </Row>
                </div>

                <div className={styles.formSection}>
                  <Form.Item name="currentLocation" valuePropName="checked">
                    <Checkbox onChange={handleCurrentLocationChange}>
                      This is the current active location
                    </Checkbox>
                  </Form.Item>

                  <Button
                    icon={<FaMapMarkerAlt />}
                    onClick={getCurrentLocation}
                    loading={isPickingGPS}
                    disabled={isPickingGPS}
                    className={`${styles.gpsButton} ${isGpsPicked ? styles['gpsButton--captured'] : ''}`}
                    size="large"
                  >
                    {isGpsPicked ? (
                      <>
                        <FaMapMarkerAlt /> Location Captured ({gpsAddress[0]?.toFixed(6)}, {gpsAddress[1]?.toFixed(6)})
                      </>
                    ) : (
                      "Capture GPS Coordinates"
                    )}
                  </Button>
                </div>

                <div className={styles.footer}>
                  <DialogClose asChild>
                    <Button type="button" className={styles.cancelButton}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={isSubmitting}
                    disabled={!isGpsPicked}
                    className={styles.submitButton}
                    size="large"
                  >
                    {isSubmitting ? 'Adding Location...' : 'Add Location'}
                  </Button>
                </div>
              </Form>
              </div>
            </DialogContent>
          </Dialog>
        </Col>
      </Row>
    </div>
  );
};

export default LocationDialog;