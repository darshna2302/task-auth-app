import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent= createContext()
      axios.defaults.withCredentials=true;
export const AppContextProvider = (props)=>{
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin,setIsLoggedin]=useState(false);
    const [userData,setUserData]=useState(false);

    const getAuthState=async()=>{
        try {
            const {data}=await axios.get(backendUrl+ '/api/auth/is-auth' );
            if(data.success)            {
                {
                    setIsLoggedin(true);
                    getUserData();
                }
        } }catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    
    const getUserData=async()=>{
        try {
            // console.log("=== calling getUserData ===");  
        const { data } = await axios.get(backendUrl + '/api/user/data',{ withCredentials: true });
        // console.log("=== response:", data);  
            if(data.success){
                setUserData(data.userData);
                // console.log("User data:",data.userData);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            // console.log("=== error:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }


    useEffect(()=>{
        getAuthState();
    },[])
    const value={
         backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData
    }
    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}