import Buttons from 'components/Atoms/Buttons'
import { useRouter } from 'next/router';
import React from 'react'

const IssueAccessory = () => {
  const router = useRouter(); 

  return (
    <div>
      <Buttons onClick={() => router.back()}>Back</Buttons>
    </div>
  )
}

export default IssueAccessory