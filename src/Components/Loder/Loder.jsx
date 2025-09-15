import React from 'react'
import { FadeLoader } from 'react-spinners';


function Loder() {
  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>
        <FadeLoader color="#36d7b7"/>
    </div>
  )
}

export default Loder