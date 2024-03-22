import React, { useContext } from "react";
import Modal from "../Modal/Modal";
import { ReceiptContext } from "../../../Context/CashupReciept";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import classes from "./ReceiptModal.module.css";
import logo from "./Eigtball-Logo.png";
import { format } from "date-fns";
import { HiOutlineDownload } from "react-icons/hi";
import html2canvas from "html2canvas";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";


const ReceiptModal = () => {
  const receiptContext = useContext(ReceiptContext);
  const {  hideReceiptModal,receiptData } = receiptContext;

  console.log(receiptData);

  const formatDateToWords = (dateString) => {
    if (!dateString || !Date.parse(dateString)) {
        return "Invalid Date";
      }
    const formattedDate = format(new Date(dateString), "MMMM d, yyyy");
    return formattedDate;
  };
  const downloadReceipt = () => {
    const element = document.querySelector("#receiptDets");
    console.log(element);
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "receipt.png";
      link.click();
    });
  };

  return (
    <Modal>
      <div className={classes.close}>
        <AiOutlineClose
          onClick={hideReceiptModal}
          className={classes.closeIcon}
        />
      </div>
      <div id="receiptDets" className={classes.receiptDets}>
        <div className={classes.header}>
          <div>
            {" "}
            <Image src={logo} alt="logo" width={30} height={30} />
          </div>
          8Ball Amusement Limited
        </div>
        <p className={classes.head}>This is your cashup Receipt</p>
        <div className={classes.dateId}>
          <p>
            {receiptData.cashupDate} <span>  </span>
            <span>Time:  {receiptData.cashupTime}</span>
          </p>
          <p>CashupId: {receiptData.cashupId}</p>
        </div>
        <p>Location: {receiptData.location}</p>
        <div className={classes.cashupDets}>
          <div className={classes.section}>
            <p>Token Sold</p>
            <p>{receiptData.tokensSold}</p>
          </div>
          <div className={classes.section}>
            <p>Token Price</p>
            <p>GHC {receiptData.tokenPrice}</p>
          </div>
          <div className={classes.section}>
            <p>Commission</p>
            <p>{receiptData.commission}</p>
          </div>
          <div className={classes.section}>
            <p>Total Sale</p>
            <p>{receiptData.totalSale}</p>
          </div>
          <div className={classes.section}>
            <p>Site Share</p>
            <p>{receiptData.siteShare}</p>
          </div>
          <div className={classes.section}>
            <p>8Ball Share</p>
            <p>GHC {receiptData.companyAmount}</p>
          </div>
          <div className={classes.section}>
            <p>Cash Recieved</p>
            <p>GHC {receiptData.cashReceived}</p>
          </div>
          <div className={classes.section}>
            <p>Balance</p>
            <p>GHC {receiptData.balance}</p>
          </div>
          <div className={classes.section}>
            <p>Start Float</p>
            <p>{receiptData.startFloat}</p>
          </div>
          <div className={classes.section}>
            <p>Close Float</p>
            <p>{receiptData.closeFloat}</p>
          </div>
          <div className={classes.section}>
            <p>Tokens Issued</p>
            <p>{receiptData.tokensIssued}</p>
          </div>
        </div>
        <div className={classes.footer}>
          <div className={classes.section}>
            <p>Receipt Issued By:</p>
            <p className={classes.blue}>{receiptData.enteredBy === 'richard.ababio@eightball.com'? "Richard Ababio" :"Samuel Bempong" }</p>
          </div>
          <div className={classes.section}>
            <p>Payment Method: </p>
            <p className={classes.blue}>Cash</p>
          </div>
          <p className={classes.foot}>
           Keep reciept safe for future refrences. For any complaints or enquiries contact us on 0245830990
          </p>
          <div className={classes.socials}>
            <FaInstagram />
            <FaFacebook />
            <FaYoutube />
            </div>
         
        </div>
      </div>
      <div className={classes.button}>
      <HiOutlineDownload />
        <button onClick={downloadReceipt}>
          Download
        </button>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
