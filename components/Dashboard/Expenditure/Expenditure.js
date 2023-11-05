import React from 'react'
import { useForm } from "react-hook-form";
import classes from './Expenditure.module.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import ExpenYears from './ExpenYears/ExpenYears';
import moment from 'moment'


const ExpenditurePage = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const notify = () => toast.success("Expenditure Added!",  {
        position: 'top-center',
      });

      const onSubmit = async data=>{
        const pushdata ={
            ...data,
            amount:Number(data.amount),
      year: moment(data.expenditureDate).format('YYYY'),

        }

        const info={
            ...pushdata,
        
        }
        notify()


        const res = await fetch('/api/expenditure', {
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
                <h2>Add a New Expenditure</h2>
            
                <div className={classes.section}>
                    <label>Date </label>
                    <input
                        placeholder='Date'
                        type='date'
                        {...register("expenditureDate", { required: true })}
                    />
                    {errors.expenditureDate && <p className={classes.errors}>Date is required</p>}
                </div>

                <div className={classes.section}>
                    <label>Type of Expenditure</label>
                    <input
                        placeholder='Expenditure Type'
                        type='text'
                        {...register("expenditureType", { required: true })}
                    />
                    {errors.expenditureType && <p className={classes.errors}>Expenditure Type is required</p>}
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

                
              <div className={classes.button}>  <button>Add Assert</button></div>

            </form>
        </div>
        <ExpenYears/>
    </div>
  )
}

export default ExpenditurePage