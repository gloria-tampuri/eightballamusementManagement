import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import {BiCalculator, BiMoney, BiReceipt } from "react-icons/bi";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import useSWR from "swr";
import CashUpList from "./CashUpList";
import { getSignedInEmail } from "../../../auth";
import { ReceiptContext } from "../../../Context/CashupReciept";
import ReceiptModal from "../ReceiptModal/ReceiptModal";
import styles from "./CashUp.module.css";
import Back from "components/ui/back/back";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const CashUp = () => {
  // State management
  const [admin, setAdmin] = useState(false);
  const [personEmail, setPersonEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    cashupDate: "",
    cashupTime: "",
    tokenPrice: 0,
    tokensSold: 0,
    commission: 0,
    cashReceived: 0,
    tokensIssued: 0,
    closeFloat: 0,
  });

  // Calculated states
  const [calculations, setCalculations] = useState({
    totalSale: 0,
    siteShare: 0,
    companyAmount: 0,
    balance: 0,
    startFloat: 0,
  });

  const receiptContext = useContext(ReceiptContext);
  const { receiptModal, showReceiptModal, receiptData, setReceiptData } = receiptContext;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const router = useRouter();
  const { assert } = router.query;

  const { data, error, isLoading } = useSWR(`/api/asserts/${assert}`, fetcher, {
    refreshInterval: 1000,
  });

  // Initialize user and date/time
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        const email = await getSignedInEmail();
        setPersonEmail(email);
        setAdmin(email === "richard.ababio@eightball.com");
        
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        const formattedTime = currentDate.toTimeString().split(' ')[0].slice(0, 5);
        
        setFormData(prev => ({
          ...prev,
          cashupDate: formattedDate,
          cashupTime: formattedTime
        }));
      } catch (error) {
        console.error("Initialization error:", error);
        toast.error("Failed to initialize component");
      }
    };

    initializeComponent();
  }, []);

  // Calculation functions
  const calculateTotals = useCallback(() => {
    const { tokenPrice, tokensSold, commission, cashReceived, tokensIssued, closeFloat } = formData;
    
    const totalSale = Math.round(tokenPrice * tokensSold);
    const siteShare = Math.round(tokenPrice * tokensSold * commission);
    const companyAmount = Math.round(tokenPrice * tokensSold * (1 - commission));
    const balance = companyAmount - cashReceived;
    const startFloat = Number(tokensIssued) + Number(closeFloat);

    setCalculations({
      totalSale,
      siteShare,
      companyAmount,
      balance,
      startFloat,
    });
  }, [formData]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: Number(value) || 0
    }));
  };

  const location = data?.assert?.location;
  const current = location?.find((val) => val.currentLocation === true);

  const notify = (message, type = "success") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  };

  const fetchLastCashUp = async () => {
    try {
      const response = await fetch(`/api/asserts/${assert}`);
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
      notify("Failed to fetch receipt data", "error");
    }
  };

  const onSubmit = async () => {
    if (calculations.companyAmount <= 0) {
      notify("Company amount must be greater than 0", "error");
      return;
    }

    if (formData.cashReceived <= 0) {
      notify("Cash received must be greater than 0", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const receivedInfo = {
        ...formData,
        ...calculations,
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

      if (response.ok) {
        notify("Cashup added successfully!");
        
        // Reset form
        setFormData(prev => ({
          ...prev,
          tokenPrice: 0,
          tokensSold: 0,
          commission: 0,
          cashReceived: 0,
          tokensIssued: 0,
          closeFloat: 0,
        }));

        await fetchLastCashUp();
      } else {
        throw new Error("Failed to save cashup");
      }
    } catch (error) {
      console.error("Submit error:", error);
      notify("Failed to save cashup", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error loading data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Back/>
        <h1 className={styles.title}>
         {current?.locationName}
        </h1>
      </div>

      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGrid}>
            {/* Date and Time Section */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <BiReceipt className={styles.sectionIcon} />
                Session Details
              </h3>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Date</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={formData.cashupDate}
                    readOnly
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Time</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={formData.cashupTime}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Token Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <BiCalculator className={styles.sectionIcon} />
                Token Information
              </h3>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Tokens Sold</label>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Number of tokens sold"
                    value={formData.tokensSold}
                    onChange={(e) => handleInputChange('tokensSold', e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Token Price</label>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.01"
                    placeholder="Price per token"
                    value={formData.tokenPrice}
                    onChange={(e) => handleInputChange('tokenPrice', e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Commission (%)</label>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.01"
                    max="1"
                    placeholder="Site commission (e.g., 0.1 for 10%)"
                    value={formData.commission}
                    onChange={(e) => handleInputChange('commission', e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Tokens Issued</label>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Tokens issued"
                    value={formData.tokensIssued}
                    onChange={(e) => handleInputChange('tokensIssued', e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Close Float</label>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Closing float"
                    value={formData.closeFloat}
                    onChange={(e) => handleInputChange('closeFloat', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <BiMoney className={styles.sectionIcon} />
                Financial Details
              </h3>
              <div className={styles.inputGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Cash Received</label>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Cash received"
                    value={formData.cashReceived}
                    onChange={(e) => handleInputChange('cashReceived', e.target.value)}
                    required
                  />
                </div>
              
              </div>
            </div>

            {/* Calculated Values */}
            <div className={styles.calculatedSection}>
              <h3 className={styles.sectionTitle}>Calculated Values</h3>
              <div className={styles.calculatedGrid}>
                <div className={styles.calculatedItem}>
                  <span className={styles.calculatedLabel}>Total Sale:</span>
                  <span className={styles.calculatedValue}>${calculations.totalSale.toFixed(2)}</span>
                </div>
                <div className={styles.calculatedItem}>
                  <span className={styles.calculatedLabel}>Site Share:</span>
                  <span className={styles.calculatedValue}>${calculations.siteShare.toFixed(2)}</span>
                </div>
                <div className={styles.calculatedItem}>
                  <span className={styles.calculatedLabel}>8Ball Share:</span>
                  <span className={styles.calculatedValue}>${calculations.companyAmount.toFixed(2)}</span>
                </div>
                <div className={styles.calculatedItem}>
                  <span className={styles.calculatedLabel}>Balance:</span>
                  <span className={`${styles.calculatedValue} ${calculations.balance >= 0 ? styles.positiveBalance : styles.negativeBalance}`}>
                    ${calculations.balance.toFixed(2)}
                  </span>
                </div>
                <div className={styles.calculatedItem}>
                  <span className={styles.calculatedLabel}>Start Float:</span>
                  <span className={styles.calculatedValue}>{calculations.startFloat}</span>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`${styles.submitButton} ${isSubmitting ? styles.submitButtonDisabled : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Cash Up...' : 'Add Cash Up'}
          </button>
        </form>
      </div>

     {admin && <CashUpList assert={data && data.assert} />}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {receiptModal && <ReceiptModal />}
    </div>
  );
};

export default CashUp;