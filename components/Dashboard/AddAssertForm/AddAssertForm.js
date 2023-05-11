import React from 'react'
import { useForm } from "react-hook-form";
import classes from './AddAssertForm.module.css'



const AddAssertForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async data=>{

        const info={
            ...data,
            cashup:[

            ],
            expenditure: [

            ],
            location:[

            ]

        }

        const res = await fetch('/api/asserts', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(info)
          })
          if (res.status === 201) {
            reset()
            console.log('assert added!');
          } else {
            console.log('Error');
          }

    };
    return (
        <div className={classes.form}>

            <form className={classes.forms} onSubmit={handleSubmit(onSubmit)}>
                <h2>Add a New Assert</h2>
                <div className={classes.section}>
                    <label>Assert Id</label>
                    <input
                        placeholder='Assert ID'
                        type='text'
                        {...register("assertId", { required: true })}
                    />
                    {errors.assertId && <p className={classes.errors}>Assert ID is required</p>}
                </div>
                <div className={classes.section}>
                    <label>Date Purchased</label>
                    <input
                        placeholder='Date Purchased'
                        type='date'
                        {...register("datePurchased", { required: true })}
                    />
                    {errors.datePurchased && <p className={classes.errors}>Date purchased is required</p>}
                </div>

                <div className={classes.section}>
                    <label>Purchased Price</label>
                    <input
                        placeholder='Purchased price'
                        type='number'
                        {...register("purchasedPrice", { required: true })}
                    />
                    {errors.purchasedPrice && <p className={classes.errors}>Price is required</p>}
                </div>

                <div className={classes.section}>
                    <label>State of Assert</label>
                    <input
                        placeholder='Assert State'
                        type='text'
                        {...register("assertState", { required: true })}
                    />
                    {errors.assertState && <p className={classes.errors}>State is required</p>}
                </div>
              <div className={classes.button}>  <button>Add Assert</button></div>
            </form>
        </div>
    )
}

export default AddAssertForm