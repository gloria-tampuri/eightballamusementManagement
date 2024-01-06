import React, { useState } from 'react'
import { getSignedInEmail } from '../../../auth';
import { set } from 'date-fns';


const OperatorWeeklyCashups = () => {
    const[operatorName, setOperatorName]= useState(false)

    getSignedInEmail()
    .then((email) => {
      if(email === 'samuel.bempong@eightball.com'){
        setOperatorName('Samuel Bempong')
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return (
    <div>
        <h1>WeeklyCashups of {operatorName}</h1>
    </div>
  )
}

export default OperatorWeeklyCashups