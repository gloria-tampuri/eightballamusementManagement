import React from 'react'
import { useRouter } from 'next/router'
import classes from './CashUp.module.css'
import { BiArrowBack } from 'react-icons/bi'
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr'
import CashUpList from './CashUpList';

const fetcher = (...args) => fetch(...args).then(res => res.json())


const CashUp = () => {
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const router = useRouter()
    const {assert}= router.query;
  
 
    const { data, error, isLoading } = useSWR( `/api/asserts/${assert}`,fetcher)
console.log(data);

   const onSubmit =async receivedInfo=>{
        const dataPush={
            cashupId:uuidv4(),
            ...receivedInfo,
            updatedAt: new Date()
        }
       

        const postData={
            assertId:data?.assert?.assertId,
            datePurchased:data?.assert?.datePurchased,
            purchasedPrice:data?.assert?.purchasedPrice,
            assertState:data?.assert?.assertState,
            createdAt: data?.assert?.createdAt,
            
            cashup:[
                ...data.assert.cashup,
                dataPush
            ],
            expenditure:[
                ...data.assert.expenditure,
            ],
            location:[
                ...data.assert.location
            ]

        }
// Do you mean assert id or assert: yes   i got assert from router.query
        const response = await fetch( `/api/asserts/${assert}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData)
        })
        if (response.ok) {
            reset();
        }
       

   };
  
  
  

  
  
  
    return (
        <div className={classes.infoAddition}>
            {/* <ToastContainer/> */}

            <div className={classes.back} onClick={() => router.back()}>       <BiArrowBack />Back</div>
            <h2>Cash Up for {data?.assert?.assertId}</h2>

            <div>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.section}>
                        <label>Date</label>
                        <input
                            placeholder='Date'
                            type='date'
                            {...register("date", { required: true })}
                        />
                        {errors.date && <p className={classes.errors}>Date needed</p>}
                    </div>
                    <div className={classes.section}>
                        <label>Number of tokens Played</label>
                        <input
                            placeholder='number of tokens Played'
                            type='number'
                            {...register("numberOfTokensPlayed", { required: true })}
                        />
                        {errors.numberOfTokensPlayed && <p className={classes.errors}>Number of tokens Played needed</p>}
                    </div>

                    <div className={classes.section}>
                        <label>Token Price</label>
                        <input
                            placeholder='Token price'
                            type='number'
                            {...register("tokenPrice", { required: true })}
                        />
                        {errors.tokenPrice && <p className={classes.errors}>Token Price needed</p>}
                    </div>

                    <div className={classes.section}>
                        <label>Percentage</label>
                        <input
                            placeholder='Site Percentage'
                            type='number'
                            {...register("percentage", { required: true })}
                        />
                        {errors.percentage && <p className={classes.errors}>Percentage needed</p>}
                    </div>



                    <div className={classes.section}>
                        <label>Number of free tokens</label>
                        <input
                            placeholder='Number of free tokens'
                            type='number'
                            {...register("numberOfFreeTokens", { required: true })}
                        />
                        {errors.numberOfFreeTokens && <p className={classes.errors}>Number of free tokens needed</p>}
                    </div>
                    <div className={classes.section}>
                        <label>Total Amount</label>
                        <input
                            placeholder='Total Amount'
                            type='number'
                            {...register("totalAmount", { required: true })}
                        />
                        {errors.totalAmount && <p className={classes.errors}>Total Amount needed</p>}
                    </div>
                    <div className={classes.section}>
                        <label>Amount given to site</label>
                        <input
                            placeholder='Amount given to site'
                            type='number'
                            {...register("siteAmount", { required: true })}
                        />
                        {errors.siteAmount && <p className={classes.errors}>Amount given to site needed</p>}
                    </div>

                    <div className={classes.section}>
                        <label>Company Amount</label>
                        <input
                            placeholder='Company Amount'
                            type='number'
                            {...register("companyAmount", { required: true })}
                        />
                        {errors.companyAmount && <p className={classes.errors}>Company Amount needed</p>}
                    </div>
                    <div></div>

                    <div className={classes.button}>  <button>Add Cash Up</button></div>
                </form>
            </div>

    <CashUpList assert={data&&data.assert}/>


        </div>
    )
}

export default CashUp