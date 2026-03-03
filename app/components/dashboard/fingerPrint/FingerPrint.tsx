import React, { useEffect } from 'react'
import Fingerprint from '@fingerprintjs/fingerprintjs'
import os from 'os'
import axios from 'axios'
import { BASE_API } from '@/service/queryKeys'
// const si = require('systeminformation');
//  const fpPromise = import('https://openfpcdn.io/fingerprintjs/v5')
const FingerPrint = () => {

  const handleGetFingerPrint = async () => {

    const data = await axios.post(`${BASE_API}/gemini/chat`,({}));
    console.log(data);





    const fp = await navigator.getBattery()

    console.log('yeeee teea finger print ', fp);
   

    console.log("Platform:", os.platform());
    console.log("OS Type:", os.type());
    console.log("Release:", os.release());
    console.log("Architecture:", os.arch());
    console.log("CPU Cores:", os.cpus().length);
    console.log(formatMemory(os.totalmem()));
console.log(formatMemory(os.freemem()))
    // console.log("Total Memory (GB):", (os.totalmem() / 1024 / 1024 / 1024).toFixed(2));
    // console.log("Free Memory (GB):", (os.freemem() / 1024 / 1024 / 1024).toFixed(2));
    console.log("Hostname:", os.hostname());
    console.log("Uptime (seconds):", os.uptime());
    // console.log("User Info:", os.userInfo());
  
  }
 function formatMemory(bytes) {
  const gb = bytes / (1024 ** 3);
  const mb = bytes / (1024 ** 2);

  return `${gb.toFixed(2)} GB (${mb.toFixed(2)} MB)`;
}

// const total = formatMemory(os.totalmem());
// const free = formatMemory(os.freemem());



  return (
    <h1 className='text-black ' onClick={handleGetFingerPrint}>hello</h1>
  )
}

export default FingerPrint