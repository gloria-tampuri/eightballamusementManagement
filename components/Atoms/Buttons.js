import React from 'react'

const Buttons = ({ onClick, children }) => {
  return (
    <div onClick={onClick}>
        <button style={{minWidth:"7rem", background:"#3F4AF3", color:"#fff", fontWeight:"bold", border:"none",borderRadius:"0.2rem", padding:"0.3rem"}}>{children}</button>
    </div>
  )
}

export default Buttons