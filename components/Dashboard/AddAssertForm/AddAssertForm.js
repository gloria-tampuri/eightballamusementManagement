import React from 'react'
import { useForm } from "react-hook-form";
import classes from './AddAssertForm.module.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';



const AddAssertForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const notify = () => toast.success("Asset Added !",  {
        position: 'top-center',
      });

    const onSubmit = async data=>{
        const pushdata ={
            ...data,
            purchasedPrice:Number(data.purchasedPrice)
        }

        const info={
            ...pushdata,
            cashup:[

            ],
            expenditure: [

            ],
            location:[

            ]

        }
        notify()


        const res = await fetch('/api/asserts', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(info)
          })
          if (res.status === 201) {
            reset()
          } else {
            console.log('Error');
          }

    };
    return (
        <div className={classes.form}>
              <ToastContainer/>

            <form className={classes.forms} onSubmit={handleSubmit(onSubmit)}>
                <h2>Add a New Asset</h2>
                <div className={classes.section}>
                    <label>Asset Number</label>
                    <input
                        placeholder='Assert Number'
                        type='text'
                        {...register("assertId", { required: true })}
                    />
                    {errors.assertId && <p className={classes.errors}>Assert ID is required</p>}
                </div>
                <div className={classes.section}>
                    <label>Date Installed</label>
                    <input
                        placeholder='Date Installed'
                        type='date'
                        {...register("datePurchased", { required: true })}
                    />
                    {errors.datePurchased && <p className={classes.errors}>Date purchased is required</p>}
                </div>

        
              <div className={classes.button}>  <button>Add Assert</button></div>

            </form>
        </div>
    )
}

export default AddAssertForm