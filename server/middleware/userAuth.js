import jwt from "jsonwebtoken";
const userAuth=(req,res,next)=>{
       console.log("COOKIES RECEIVED:", req.cookies);
     const {token}=req.cookies;
        if(!token)
        {
            return res.json({success:false,message:"Not authorized, please login"})
        }
    try{
       
        const tokenDecoded=jwt.verify(token,process.env.JWT_SECRET);
              console.log("DECODED:", tokenDecoded); 
        if(tokenDecoded.id)
        {
            req.userId=tokenDecoded.id;
            
        }else{
            return res.json({success:false,message:"Invalid token, please login again"})
        }
        next();
    }
    catch(err)
    {
        console.log("jwt verify error:", err.message); 
       return res.json({success:false,message:"Invalid Token"})
    }
}

export default userAuth;