import db from "../config/db.js";

export const getUserData=(req,res)=>{
    try {
        const userId=req.userId;
  
        const query="SELECT user_id,username,email,isAccountVerified FROM users WHERE user_id=?";
 
        
        db.query(query,[userId],(err,result)=>{
            
            if(err)
            {
                return res.json({success:false,message:err.message})
            }
            if(result.length===0)
            {
                return res.json({success:false,message:"User not found"})
            }
            const user=result[0];
            return res.json({success:true,userData:user})
        })
    } catch (error) {
            return res.json({success:false,message:error.message})
    }
}