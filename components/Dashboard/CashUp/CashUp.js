import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import classes from "./CashUp.module.css";
import { BiArrowBack } from "react-icons/bi";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import CashUpList from "./CashUpList";
import { getSignedInEmail } from "../../../auth";
import { ReceiptContext } from "../../../Context/CashupReciept";
import ReceiptModal from "../ReceiptModal/ReceiptModal";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const CashUp = () => {
  const [admin, setAdmin] = useState(false);
  const [personEmail, setPersonEmail] = useState("");
  const [cashupDate, setCashupDate] = useState("");
  const [cashupTime, setCashupTime] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [commission, setCommission] = useState(0);
  const [companyAmount, setCompanyAmount] = useState(0);
  const [siteShare, setSiteShare] = useState(0);
  const [cashReceived, setCashReceived] = useState(0);
  const [balance, setBalance] = useState(0);
  const [tokensIssued, setTokensIssued] = useState(0);
  const [startFloat, setStartFloat] = useState(0);
  const [closeFloat, setCloseFloat] = useState(0);
  const [cashuplocation, setCashupLocation] = useState("");


  const receiptContext=useContext(ReceiptContext)
  const {receiptModal, showReceiptModal,receiptData,setReceiptData }=receiptContext
  useEffect(() => {
    getSignedInEmail()
      .then((email) => {
        setPersonEmail(email);
        if (email === "richard.ababio@eightball.com") {
          setAdmin(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
        // Set current date
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        const formattedTime = currentDate.toTimeString().split(' ')[0].slice(0, 5); // HH:MM format
        setCashupDate(formattedDate);
        setCashupTime(formattedTime);
  }, []);

  const CaltotalAmount = () => {
    const total = tokenPrice * tokensSold;
    setTotalSale(Math.round(total));
  };

  
  const siteShareHandler = () => {
    const percentage = commission;
    const price = tokenPrice;
    const soldTokens = tokensSold;
    const siteMoney = price * soldTokens * percentage;
    setSiteShare(Math.round(siteMoney));
  };
  // siteShareHandler()

  const companySharehandler = () => {
    const percentage = commission;
    const price = tokenPrice;
    const soldTokens = tokensSold;
    const companyPercentage = 1 - percentage;
    const companyMoney = price * soldTokens * companyPercentage;
    setCompanyAmount(Math.round(companyMoney));
  };
  // companySharehandler()
  useEffect(() => {
    CaltotalAmount();
    siteShareHandler();
    companySharehandler();
    balanceHandler();
    startFloatHandler();
  }, [
    tokenPrice,
    tokensSold,
    commission,
    cashReceived,
    closeFloat,
    tokensIssued,
  ]);

  const balanceHandler = () => {
    const bb = companyAmount - cashReceived;
    setBalance(bb);
  };
  const startFloatHandler = () => {
    const totaltokens = +tokensIssued + +closeFloat;
    setStartFloat(totaltokens);
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const { assert } = router.query;

  const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher, {
    refreshInterval: 1000,
  });

  const location = data?.assert?.location;
  const current = location?.find((val) => val.currentLocation === true);

  const notify = () =>
    toast.success("Cashup Added Successfully !", {
      position: "top-center",
    });

    const fetchLastCashUp = async () => {
      try {
        const response = await fetch(`/api/asserts/${assert}`); // Assuming `assert` is defined somewhere
        if (response.ok) {
          const data = await response.json();
          const lastCashUp = data.assert.cashup[data.assert.cashup.length - 1];
          setReceiptData(lastCashUp);
          showReceiptModal(lastCashUp);

        } else {
          throw new Error("Failed to fetch last cash-up");
        }
      } catch (error) {
        console.error(error);
      }


    };
  


  const onSubmit = async () => {
    // e.preventDefault()

    const receivedInfo = {
      cashupDate: cashupDate,
      cashupTime: cashupTime,
      tokensSold: Number(tokensSold),
      tokenPrice: Number(tokenPrice),
      commission: Number(commission),
      totalSale: Number(totalSale),
      siteShare: Number(siteShare),
      companyAmount: Number(companyAmount),
      cashReceived: Number(cashReceived),
      balance: Number(balance),
      startFloat: Number(startFloat),
      closeFloat: Number(closeFloat),
      tokensIssued: Number(tokensIssued),
      enteredBy: personEmail,
    };
    const dataPush = {
      location: current?.locationName,
      cashupId: uuidv4(),
      ...receivedInfo,
      updatedAt: new Date(),
    };

    const postData = {
      assertId: data?.assert?.assertId,
      datePurchased: data?.assert?.datePurchased,
      purchasedPrice: data?.assert?.purchasedPrice,
      assertState: data?.assert?.assertState,
      createdAt: data?.assert?.createdAt,
      cashup: [...data.assert.cashup, dataPush],
      expenditure: [...data.assert.expenditure],
      location: [...data.assert.location],
    };

    const response = await fetch(`/api/asserts/${assert}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    notify();
    if (response.ok) {
      setCashupDate(""),
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
        setTokensIssued(0);
    }
     // Wait for the latest cash-up data to be fetched
  await fetchLastCashUp();

    };

  return (
    <div className={classes.infoAddition}>
      {/* <ToastContainer/> */}
      <div className={classes.back} onClick={() => router.back()}>
        <BiArrowBack />
        Back
      </div>
      <h2>
        {data?.assert?.assertId} {current?.locationName}
      </h2>

      <div className="no-print">
        <form
          className={`${classes.form} no-print `}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={classes.section}>
            <label>Date</label>
            <input
              placeholder="Date"
              type="date"
              value={cashupDate}
              required
              readOnly
              onChange={(e) => {
                setCashupDate(e.target.value);
              }}
            />
          </div>

          <div className={classes.section}>
            <label>Time</label>
            <input
              placeholder="Time"
              type="text"
              value={cashupTime}
              readOnly
              required
              onChange={(e) => {
                setCashupTime(e.target.value);
              }}
            />
          </div>
          <div className={classes.section}>
            <label>Sold Tokens</label>
            <input
              placeholder="number of tokens Played"
              type="number"
              required
              value={tokensSold}
              onChange={(e) => {
                setTokensSold(e.target.value);
              }}
              

            />
          </div>

          <div className={classes.section}>
            <label>Token Price</label>
            <input
              placeholder="Token price"
              type="number"
              required
              value={tokenPrice}
              onChange={(e) => {
                setTokenPrice(e.target.value);
              }}
            />
          </div>

          <div className={classes.section}>
            <label>Commission</label>
            <input
              placeholder="Site Percentage"
              type="number"
              required
              value={commission}
              onChange={(e) => {
                setCommission(e.target.value);
              }}

            />
          </div>

          <div className={classes.section}>
            <label>Total Sale</label>
            <input
              placeholder="Total Amount"
              type="number"
              required
              value={totalSale}
              onChange={CaltotalAmount}
            />
          </div>

          <div className={classes.section}>
            <label>Site Share</label>
            <input
              placeholder="Number of free tokens"
              type="number"
              value={siteShare}
              onChange={siteShareHandler}
              required

            />
          </div>

          <div className={classes.section}>
            <label>8Ball Share</label>
            <input
              placeholder="Company share"
              type="number"
              {...register("companyAmount", { required: true })}
              value={companyAmount}
              onChange={companySharehandler}
              required
            />
          </div>
          <div className={classes.section}>
            <label>Cash Received</label>
            <input
              placeholder="cash recieved"
              type="number"
              required
              value={cashReceived}
              onChange={(e) => {
                setCashReceived(e.target.value);
              }}
            />
          </div>

          <div className={classes.section}>
            <label>Balance</label>
            <input
              placeholder="Balance"
              type="number"
              required
              value={balance}
              onChange={balanceHandler}
            />
          </div>
          <div className={classes.section}>
            <label>Tokens Issued</label>
            <input
              placeholder="Token Issued"
              type="number"
              required
              value={tokensIssued}
              onChange={(e) => {
                setTokensIssued(e.target.value);
              }}
            />
          </div>
          <div className={classes.section}>
            <label>Close Float</label>
            <input
              placeholder="End float"
              type="number"
              required
              value={closeFloat}
              onChange={(e) => {
                setCloseFloat(e.target.value);
              }}
            />
          </div>
          <div className={classes.section}>
            <label>Start Float</label>
            <input
              placeholder="Start float"
              type="number"
              required
              value={startFloat}
              onChange={startFloatHandler}
            />
          </div>

          <div className={classes.button}>
            <button>Add Cash Up</button>
          </div>
        </form>
      </div>

      <CashUpList assert={data && data.assert} />
      <ToastContainer />
      {receiptModal && <ReceiptModal/>}
    </div>
  );
};

export default CashUp;
