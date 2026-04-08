import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext.jsx'
import { Navigate, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate=useNavigate();
  const {userData,isLoggedin}=useContext(AppContent);
   console.log("=== userData in Header:", userData);

  return (
    <div className='flex flex-col items-center mt-10 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-4'/>
        <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
           Hello {userData ? userData.username : "Developer"}! <img src={assets.hand_wave} alt='' className='w-8 aspect-square'/>
        </h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our App</h2>
        <p className='mb-8 max-w-md'>Lets start with a quick product tour and we will have you up and running in no time</p>
        <div className='flex'>
          
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all mr-5' onClick={()=>navigate("/file-upload")}>File upload</button>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all mr-5' onClick={()=>navigate("/LiveTable")}>Live Table</button>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all' onClick={()=>navigate("/stocks")}>Stock Table</button>
        </div>
        <div className='mt-8 flex'>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all mr-5' onClick={()=>navigate("/taskForm")}>Create Task</button>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all mr-5' onClick={()=>navigate("/taskTable")}>Task table</button>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all' onClick={()=>navigate("/grafana-iframe")}>Grafana Iframe</button>

        </div>
    </div>
  )
}

export default Header