import React from 'react'
import { useForm } from "react-hook-form";
import classes from './Transport.module.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
// import ExpenYears from './ExpenYears/ExpenYears';
import moment from 'moment'

const TransportForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const notify = () => toast.success("Transport Added!",  {
        position: 'top-center',
      });

      const onSubmit = async data=>{
        const pushdata ={
            ...data,
            amount:Number(data.amount),
      year: moment(data.transportDate).format('YYYY'),

        }

        const info={
            ...pushdata,
        
        }
        notify()


        const res = await fetch('/api/transport', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(info)
          })
          if (res.status === 201) {
            reset()
          } else {
          }

    };

    return (
        <div>
                <div className={classes.form}>
                  <ToastContainer/>
    
                <form className={classes.forms} onSubmit={handleSubmit(onSubmit)}>
                    <h2>Add Transport</h2>
                
                    <div className={classes.section}>
                        <label>Date </label>
                        <input
                            placeholder='Date'
                            type='date'
                            {...register("transportDate", { required: true })}
                        />
                        {errors.transportDate && <p className={classes.errors}>Date is required</p>}
                    </div>
    
                    <div className={classes.section}>
                        <label>From</label>
                        <input
                            placeholder='From'
                            type='text'
                            {...register("from", { required: true })}
                        />
                        {errors.from && <p className={classes.errors}>From</p>}
                    </div>

                    <div className={classes.section}>
                        <label>Destination</label>
                        <input
                            placeholder='Destination'
                            type='text'
                            {...register("destination", { required: true })}
                        />
                        {errors.destination && <p className={classes.errors}>Destination</p>}
                    </div>
    
                    <div className={classes.section}>
                        <label>Amount</label>
                        <input
                            placeholder='Amount'
                            type='number'
                            {...register("amount", { required: true })}
                        />
                        {errors.amount && <p className={classes.errors}>Price is required</p>}
                    </div>
    
                    
                  <div className={classes.button}>  <button>Add Transport</button></div>
    
                </form>
            </div>
        </div>
      )
}

export default TransportForm