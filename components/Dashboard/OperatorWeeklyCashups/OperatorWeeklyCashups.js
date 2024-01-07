import React, { useState, useEffect } from 'react';
import { getSignedInEmail } from '../../../auth';
import { set } from 'date-fns';
import classes from './OperatorWeeklyCashups.module.css';
import { useAssetData } from '../../../Context/AssetDataContext';
import { useRouter } from 'next/router';
import CashUp from '../CashUp/CashUp';
import { format, startOfWeek, endOfWeek } from 'date-fns';


const OperatorWeeklyCashups = () => {
  const router = useRouter();

  const [operatorName, setOperatorName] = useState('');
  const [operatorEmail, setOperatorEmail] = useState('');
  const { assetsData } = useAssetData();

  useEffect(() => {
    getSignedInEmail()
      .then((email) => {
        setOperatorEmail(email);
        if (email === 'samuel.bempong@eightball.com') {
          setOperatorName('Samuel Bempong');
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);
  console.log(assetsData);

  const startOfCurrentWeek = startOfWeek(new Date());
  const endOfCurrentWeek = endOfWeek(new Date());

  const getAllWithSamuel = assetsData?.asserts?.reduce((result, asset) => {
    // Check if 'cashup' is an array and has entries with 'enteredBy' equal to the desired email
    const cashupsWithSamuel = asset?.cashup?.filter((cashup) => cashup?.enteredBy === 'samuel.bempong@eightball.com' )
    
    
    if (cashupsWithSamuel && cashupsWithSamuel.length > 0) {
      // If there are matching entries, add them to the result
      result.push({ ...asset, cashup: cashupsWithSamuel });
    }
  
    return result;
  }, []);


  console.log(getAllWithSamuel);
  let totalSum =0

  const currentOperatorCashupData = getAllWithSamuel?.map(assert=>{
    const totalAmount = assert.cashup.reduce((total, sale) => {
        const saleDate = new Date(sale.cashupDate);
        if (saleDate >= startOfCurrentWeek && saleDate <= endOfCurrentWeek) {
          total += sale.cashReceived;
        }
        return total;
      }, 0);
      totalSum += totalAmount
      return { ...assert, totalAmount };
  })
console.log(currentOperatorCashupData);
currentOperatorCashupData?.sort((a, b) => b.totalAmount - a.totalAmount);

  

  return (
    <div className={classes.operator}>
      {/* <h1>WeeklyCashups of <span> {operatorName}</span></h1> */}
      <h2 className={classes.tabheader}>Performance of Assets enteredBy Operator{operatorName} for the week. Total Amount: {totalSum}</h2>
    <div className={classes.list}>
    <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Location</th>
            <th>AssetID</th>
            <th>Cashup Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentOperatorCashupData?.map((assert, index) => (
            <tr onClick={() => router.push(`/dashboard/asserts/${assert?._id}/cashup `)} key={assert?._id}>
              <td>{index + 1}</td>
              <td className={classes.color}>
                {assert?.location.find(val => val?.currentLocation === true)?.locationName}
              </td>
              <td>{assert?.assertId}</td>
              <td className={classes.color}>
                {assert?.totalAmount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default OperatorWeeklyCashups;
