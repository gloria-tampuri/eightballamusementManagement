import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import classes from "./Accessory.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Buttons from "../../Atoms/Buttons";
import Link from "next/link";

const Accessory = () => {
  const [listOfData, setListOfData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [updateNumber, setUpdateNumber]=useState(0)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const notify = () =>
    toast.success("Accessory Added!", {
      position: "top-center",
    });

  const onSubmit = async (data) => {
    const pushdata = {
      ...data,
      quantity: Number(data.quantity),
    };

    const info = {
      ...pushdata,
      issues: [],
    };
    notify();
    const res = await fetch("/api/accessories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });
    if (res.status === 201) {
      reset();
    } else {
    }
  };

  useEffect(() => {
    fetch("/api/accessories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        console.log(data);
        setListOfData(data.accessory);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
      });
  }, []);

  const handleUpdate = async () => {
    if (!selectedValue || updateNumber === 0) {
      toast.error("Please select an item and enter a valid quantity");
      return;
    }
  
    const selectedAccessory = listOfData.find(
      (accessory) => accessory.accessoryname === selectedValue
    );
  
    if (!selectedAccessory) {
      toast.error("Selected accessory not found");
      return;
    }
  
    const updatedQuantity = selectedAccessory.quantity + Number(updateNumber);
  
    try {
      const res = await fetch(`/api/accessories/${selectedAccessory._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: updatedQuantity }),
      });
  
      if (res.ok) {
        toast.success("Quantity updated successfully");
        setUpdateNumber(0);
        // Refresh the list of accessories
        const updatedListResponse = await fetch("/api/accessories");
        const updatedListData = await updatedListResponse.json();
        setListOfData(updatedListData.accessory);
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("An error occurred while updating quantity");
    }
  };

  return (
    <div className={classes.form}>
      <ToastContainer />
<Link href='issue' className={classes.issue}>      <Buttons>Issue An Accessory</Buttons>
</Link>
      <form className={classes.forms} onSubmit={handleSubmit(onSubmit)}>
        <h2>Add a New Accessory</h2>
        <div className={classes.section}>
          <label>Accessory Name</label>
          <input
            placeholder="Accessory Name"
            type="text"
            required
            {...register("accessoryname", { required: true })}
          />
          {errors.accessoryname && (
            <p className={classes.errors}>Accessory ID is required</p>
          )}
        </div>
        <div className={classes.section}>
          <label>Quantity</label>
          <input
            placeholder="Quantity"
            type="number"
            required
            {...register("quantity", { required: true })}
          />
          {errors.quantity && (
            <p className={classes.errors}>Quantity is required</p>
          )}
        </div>

        <div className={classes.button}>
          <button>Add Accessory</button>
        </div>
      </form>

      <form className={classes.forms} onSubmit={(e) => {
  e.preventDefault();
  handleUpdate();
}}>
  <div className={classes.section}>
    <label>Select Item</label>
    <select
      value={selectedValue}
      onChange={(e) => setSelectedValue(e.target.value)}
    >
      <option value="">Select an accessory</option>
      {listOfData &&
        listOfData.map((accessory) => (
          <option key={accessory._id} value={accessory.accessoryname}>
            {accessory.accessoryname}
          </option>
        ))}
    </select>
  </div>
  <div className={classes.section}>
    <label>Quantity to Add</label>
    <input
      type="number"
      value={updateNumber}
      onChange={(e) => {setUpdateNumber(e.target.value)}}
    />
  </div>
  <div className={classes.button}>
    <button type="submit">Update Quantity</button>
  </div>
</form>
    </div>
  );
};

export default Accessory;
