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
  Card,
  Typography,
  message,
  Row,
  Col,
  Space,
} from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import LocationList from "./LocationList";
import LocationDialog from "./LocationDialog";
import styles from "./Location.module.css";
import Back from "components/ui/back/back";

const { Text, Title } = Typography;
const { TextArea } = Input;

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Location = () => {
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
    message.loading({ content: "Getting your location...", key: "gps" });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGpsAddress([latitude, longitude]);
          setIsGpsPicked(true);
          setIsPickingGPS(false);
          message.success({
            content: "Location captured!",
            key: "gps",
            duration: 2,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsPickingGPS(false);
          message.error({
            content: `Failed to get location: ${error.message}`,
            key: "gps",
            duration: 3,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      message.error({
        content: "Geolocation is not supported by your browser",
        key: "gps",
        duration: 3,
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
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save location");
      }
    } catch (error) {
      console.error("Submission error:", error);
      message.error(
        error.message || "Failed to save location. Please try again."
      );
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
      <div className={styles.header}>
        <div>
          {" "}
          <Back />
        </div>
        <div>
          {" "}
          <LocationDialog />
        </div>
      </div>
      <Title level={2} className={styles.title}>
        Location Management
      </Title>

      <Text
        type="secondary"
        style={{ textAlign: "center", display: "block", marginBottom: "32px" }}
      >
        Managing locations for Asset ID:{" "}
        <strong>{data?.assert?.assertId}</strong>
      </Text>
      <LocationList />
    </div>
  );
};

export default Location;
