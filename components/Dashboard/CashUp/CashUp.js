import React ,{useState,useEffect}from 'react'
import { useRouter } from 'next/router'
import classes from './CashUp.module.css'
import { BiArrowBack } from 'react-icons/bi'
import { useForm } from "react-hook-form";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import useSWR from 'swr'
import CashUpList from './CashUpList';


const fetcher = (...args) => fetch(...args).then(res => res.json())



const CashUp = () => {

    const[cashupDate,setCashupDate]=useState('')
    const[cashupTime,setCashupTime]=useState('')
    const[tokenPrice,setTokenPrice]=useState(0)
    const[tokensSold,setTokensSold]=useState(0)
    const[totalSale,setTotalSale]=useState(0)
    const[commission,setCommission]=useState(0)
    const[companyAmount,setCompanyAmount]=useState(0)
    const[siteShare,setSiteShare]=useState(0)
    const[cashReceived, setCashReceived]=useState(0)
    const [balance,setBalance]=useState(0)
    const[tokensIssued, setTokensIssued]=useState(0)
    const[startFloat, setStartFloat]=useState(0)
    const[closeFloat,setCloseFloat]=useState(0)
    
    const CaltotalAmount =()=>{
      const total = tokenPrice*tokensSold
      setTotalSale(Math.round(total))
    }
    // CaltotalAmount()

    const siteShareHandler=()=>{
        const percentage = commission
        const price =tokenPrice
        const soldTokens = tokensSold
        const siteMoney = (price * soldTokens)*percentage
        setSiteShare(Math.round(siteMoney))
    } 
    // siteShareHandler()

    const companySharehandler=()=>{
        const percentage = commission
        const price =tokenPrice
        const soldTokens = tokensSold
        const companyPercentage = 1-percentage
        const companyMoney = (price * soldTokens)*companyPercentage
        setCompanyAmount(Math.round(companyMoney))
    }
    // companySharehandler()
    useEffect(() => {
        CaltotalAmount();
        siteShareHandler();
        companySharehandler();
        balanceHandler();
        startFloatHandler()
    }, [tokenPrice, tokensSold, commission, cashReceived,closeFloat,tokensIssued]);

    const balanceHandler=()=>{
        const bb =( companyAmount - cashReceived)
        setBalance(bb)
    }
    const startFloatHandler=()=>{
        const totaltokens = +tokensIssued + (+closeFloat)
        setStartFloat(totaltokens)
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const router = useRouter()
    const {assert}= router.query;
  
   
    const { data, error, isLoading } = useSWR( `/api/asserts/${assert}`,fetcher,{refreshInterval: 1000})

const location=data?.assert?.location
const current = location?.find((val)=>val.currentLocation===true)

const notify = () => toast.success("Cashup Added Successfully !",{
    position: 'top-center',
  });
   const onSubmit =async()=>{
    // e.preventDefault()
    

    const receivedInfo={
        cashupDate:cashupDate,
        cashupTime:cashupTime,
        tokensSold:Number(tokensSold),
        tokenPrice:Number(tokenPrice),
        commission:Number(commission),
        totalSale:Number(totalSale),
        siteShare:Number(siteShare),
        companyAmount:Number(companyAmount),
        cashReceived:Number(cashReceived),
        balance:Number(balance),
        startFloat:Number(startFloat),
        closeFloat:Number(closeFloat),
        tokensIssued:Number(tokensIssued)
    }
        const dataPush={
            location:current?.locationName,
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
        notify()
        if (response.ok) {
            setCashupDate(''),
        setTokensSold(0),
        setTokenPrice(0),
        setCommission(0),
        setTotalSale(0),
        setSiteShare(0),
        setCompanyAmount(0),
        setCashReceived(0),
        setBalance(0),
        setStartFloat(0),
        setCloseFloat(0),
        setTokensIssued(0)
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
                            value={cashupDate}
                            // {...register("date", { required: true })}
                            onChange={(e)=>{setCashupDate(e.target.value)}}
                        />
                        {/* {errors.date && <p className={classes.errors}>Date needed</p>} */}
                    </div>

                    <div className={classes.section}>
                        <label>Time</label>
                        <input
                            placeholder='Time'
                            type='text'
                            value={cashupTime}
                            // {...register("Time", { required: true })}
                            onChange={(e)=>{setCashupTime(e.target.value)}}
                        />
                        {/* {errors.date && <p className={classes.errors}>Date needed</p>} */}
                    </div>
                    <div className={classes.section}>
                        <label>Sold Tokens</label>
                        <input
                            placeholder='number of tokens Played'
                            type='number'
                            value={tokensSold}
                            onChange={(e)=>{setTokensSold(e.target.value)}}
                            // {...register("numberOfTokensPlayed", { required: true })}
                        />
                        {/* {errors.numberOfTokensPlayed && <p className={classes.errors}>Number of tokens Played needed</p>} */}
                    </div>

                    <div className={classes.section}>
                        <label>Token Price</label>
                        <input
                            placeholder='Token price'
                            type='number'
                            // {...register("tokenPrice", { required: true })}
                            value={tokenPrice}
                            onChange={(e)=>{setTokenPrice(e.target.value)}}
                        />
                        {/* {errors.tokenPrice && <p className={classes.errors}>Token Price needed</p>} */}
                    </div>

                    <div className={classes.section}>
                        <label>Commission</label>
                        <input
                            placeholder='Site Percentage'
                            type='number'
                            value={commission}
                            onChange={(e)=>{setCommission(e.target.value)}}
                            // {...register("percentage", { required: true })}
                        />
                        {/* {errors.percentage && <p className={classes.errors}>Percentage needed</p>} */}
                    </div>



                    <div className={classes.section}>
                        <label>Total Sale</label>
                        <input
                            placeholder='Total Amount'
                            type='number'
                            value={totalSale}
                            // {...register("totalAmount", { required: true })}
                            onChange={CaltotalAmount}
                        />
                        {/* {errors.totalAmount && <p className={classes.errors}>Total Amount needed</p>} */}
                    </div>

                    <div className={classes.section}>
                        <label>Site Share</label>
                        <input
                            placeholder='Number of free tokens'
                            type='number'
                            value={siteShare}
                            onChange={siteShareHandler}
                            // {...register("numberOfFreeTokens", { required: true })}
                        />
                        {/* {errors.numberOfFreeTokens && <p className={classes.errors}>Number of free tokens needed</p>} */}
                    </div>

                    <div className={classes.section}>
                        <label>8Ball Share</label>
                        <input
                            placeholder='Company share'
                            type='number'
                            {...register("companyAmount", { required: true })}
                            value={companyAmount}
                            onChange={companySharehandler}
                        />
                        {/* {errors.companyAmount && <p className={classes.errors}>Company Amount needed</p>} */}
                    </div>
                    <div className={classes.section}>
                        <label>Cash Received</label>
                        <input
                            placeholder='cash recieved'
                            type='number'
                            
                            value={cashReceived}
                            onChange={(e)=>{setCashReceived(e.target.value)}}
                        />
                    </div>

                    <div className={classes.section}>
                        <label>Balance</label>
                        <input
                            placeholder='Balance'
                            type='number'
                            
                            value={balance}
                            onChange={balanceHandler}
                        />
                    </div>
                    <div className={classes.section}>
                        <label>Tokens Issued</label>
                        <input
                            placeholder='Token Issued'
                            type='number'
                            
                            value={tokensIssued}
                            onChange={(e)=>{setTokensIssued(e.target.value)}}
                        />
                    </div>
                    <div className={classes.section}>
                        <label>Close Float</label>
                        <input
                            placeholder='End float'
                            type='number'
                            
                            value={closeFloat}
                            onChange={(e)=>{setCloseFloat(e.target.value)}}
                        />
                    </div>
                    <div className={classes.section}>
                        <label>Start Float</label>
                        <input
                            placeholder='Start float'
                            type='number'
                            
                            value={startFloat}
                            onChange={startFloatHandler}
                        />
                    </div>
                  

                    <div className={classes.button}>  <button>Add Cash Up</button></div>
                </form>
            </div>

    <CashUpList assert={data&&data.assert}/>
    <ToastContainer />


        </div>
    )
}

export default CashUp