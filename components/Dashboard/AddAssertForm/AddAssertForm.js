import React from "react";
import { useForm } from "react-hook-form";
import classes from "./AddAssertForm.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
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
const AddAssertForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const notify = () =>
    toast.success("Asset Added !", {
      position: "top-center",
    });

  const onSubmit = async (data) => {
    const pushdata = {
      ...data,
      purchasedPrice: Number(data.purchasedPrice),
    };

    const info = {
      ...pushdata,
      cashup: [],
      expenditure: [],
      location: [],
    };

    notify();

    const res = await fetch("/api/asserts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });

    if (res.status === 201) {
      reset();
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    }
  };

  return (
    <div className={classes.form}>
      <ToastContainer />

      <Dialog>
        <DialogTrigger asChild>
          <AddButton text="Add New Item" />
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle> Add a New Asset</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new asset to your inventory.
            </DialogDescription>
          </DialogHeader>

          <form className={classes.forms} onSubmit={handleSubmit(onSubmit)}>
            <div className={classes.section}>
              <label>Asset Number</label>
              <input
                placeholder="Asset Number"
                type="text"
                required
                {...register("assertId", { required: true })}
              />
              {errors.assertId && (
                <p className={classes.errors}>Asset ID is required</p>
              )}
            </div>

            <div className={classes.section}>
              <label>Date Installed</label>
              <input
                placeholder="Date Installed"
                type="date"
                required
                {...register("datePurchased", { required: true })}
              />
              {errors.datePurchased && (
                <p className={classes.errors}>Date purchased is required</p>
              )}
            </div>

            <div className={classes.footer}>
              <DialogClose asChild>
                <button type="button" className={classes.cancelButton}>
                  Cancel
                </button>
              </DialogClose>
              <button type="submit" className={classes.submitButton}>
                Add Asset
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddAssertForm;
