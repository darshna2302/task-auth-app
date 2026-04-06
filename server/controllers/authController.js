import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import db from "../config/db.js"
import transporter from "../config/nodemailer.js";
import resend from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplate.js";


export const register=async(req,res)=>{
const {name,email,password}=req.body;

if(!name || ! email || !password)
{
 return res.json({
    success:false,
    message:'Missing Details'
 })
}
console.log("BODY →", req.body);

try{
    const ismatchedUser=  "SELECT user_id FROM users WHERE email = ?";
    db.query(ismatchedUser,[email],async(error,result)=>{
        if(error)
        {
            return res.json({success:false,message:error.message});
        }
        console.log("result",result);
        if(result.length >0)
        {
            return res.json({
                success:false,message:"User already exists"
            })
        }
    
     const hashedpassword=await bcrypt.hash(password,10);

     const insertUser="INSERT INTO users (username,email,password) VALUES (?,?,?)";

     db.query(insertUser,[name,email,hashedpassword],(err,data)=>{
        if(err)
        {
            return res.json({success:false,message:err.message});
        }console.log("Inserted User ID:", data.insertId);

         const token=jwt.sign({id:data.insertId},process.env.JWT_SECRET,{expiresIn:"7d"});

         //token is send as response through cookie
     res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production', //chcek with local
        sameSite:process.env.NODE_ENV === 'production'? 'none':'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
     });
     //SEND MAIL USING NODEMAILER SMTP 
    //  const mailoptions={
        // from:process.env.GMAIL_USER,
        // to:email,
        // subject:"Welcome to our app",
        // text:`Welcome to our app! Your account has been created with email id: ${email}.`
    //  }

    //  transporter.sendMail(mailoptions);

    const mailOptions={
        from:process.env.GMAIL_USER,
        to:email,
        subject:"Welcome to our app",
        text:`Welcome to our app! Your account has been created with email id: ${email}.`
    }

     transporter.sendMail(mailOptions);

     return res.json({success:true,message:"User Registered successfully"});
     })
    })
   
    //  res.json({token});
    
     
}catch(error){
   return res.json({success:false,message:error.message});
}
}

export const login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password)
    {
        return res.json({success:false,message:'Email and password are required'})
    }

    try{
        const ismatchedUser = "SELECT user_id,password FROM users WHERE email = ?";
    db.query(ismatchedUser,[email],async(error,result)=>{
        if(error)
        {
            return res.json({success:false,message:error.message});
        }
        if(result.length === 0)
        {
            return res.json({
                success:false,message:"Invalid email"
            })
        }
       const user=result[0];
        if (!user.password) {
      return res.json({
        success: false,
        message: "Password not found for this user",
      });
    }
       const isPasswordMatch = await bcrypt.compare(password,user.password);
    if(!isPasswordMatch)
    {
        return res.json({success:false,message:'Invalid Password'})
    }
    const token=jwt.sign({id:user.user_id},process.env.JWT_SECRET,{expiresIn:"7d"});
    //  res.json({token});
    //token is send as response through cookie
     res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production', //chcek with local
        sameSite:process.env.NODE_ENV === 'production'? 'none':'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
     })

     return res.json({success:true,message:"Login successful"});
    })

    
    }
    catch (error)
    {
        return res.json({success:false,message:error.message});
    }
}

export const logout=async(req,res)=>{
    try{
        //clear cookie
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({success:true,message:'Logged Out'})
    }
    catch(error)
    {
        return res.json({
            success:false,message:error.message
        })
    }
}


export const forgotPassword = (req, res) => {
  const { email } = req.body;

  const query = "SELECT user_id,email FROM users WHERE email = ?";

  db.query(query, [email], async (err, result) => {
    if (err) {
      return res.json({ success: false, message: err.message });
    }

    if (result.length === 0) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign(
      { id: result[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    console.log("SECRET USED TO SIGN:", process.env.JWT_SECRET);

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        
        <p><b>Your Login Details for Task Management System</b><br><b>Email: </b>"${result[0].email}"<br><b>Password: </b>"${result[0].password}"<br>
        <h3>Password Reset</h3>
        <p>Click below link to reset your password:</p><br>
        <a href="${resetLink}">${resetLink}</a><br>
        <p>This link expires in 15 minutes.</p>
      `,
    };

console.log("Reset Token:", token);
console.log("Reset Link:", resetLink);

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Reset link sent to email",
    });
  });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = "UPDATE users SET password=? WHERE user_id=?";

    db.query(updateQuery, [hashedPassword, decoded.id], async (err) => {
      if (err) {
        return res.json({ success: false, message: err.message });
      }

      // Optional: Get user email to send confirmation
      const getUser = "SELECT email FROM users WHERE user_id=?";
      db.query(getUser, [decoded.id], async (err, result) => {
        if (!err && result.length > 0) {
          const mailOptions = {
            from: process.env.GMAIL_USER,
            to: result[0].email,
            subject: "Password Reset Successful",
            html: `
              <h3>Your password has been reset successfully.</h3>
              <p>If you did not perform this action, please contact support immediately.</p>
            `,
          };

          await transporter.sendMail(mailOptions);
        }
      });
      console.log("SECRET USED TO SIGN:", process.env.JWT_SECRET);

      return res.json({
        success: true,
        message: "Password updated successfully",
      });
    });

  } catch (error) {
    return res.json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const sendVerifyOtp = async(req,res)=>{
    try{
         const user_id=req.userId;
         const query="SELECT isAccountVerified,email,username FROM users WHERE user_id=?";
            db.query(query,[user_id],async(err,result)=>{
                if(err)
                {
                    return res.json({success:false,message:err.message})
                }
                if(result.length === 0)
                {
                    return res.json({success:false,message:"User not found"})
                }
                const user=result[0];
                if(result[0].isAccountVerified === 1)
                {
                    return res.json({success:true,message:"Account already verified"})
                }
        
         //account not verified send otp

          const otp= String(Math.floor(100000 + Math.random()*900000));
        
          const expiryTime= new Date(Date.now() + 24*60*60*1000); //24 hours

          const otpQuery="UPDATE users SET verifyOtp=?,otp_expiry=? WHERE user_id=?";
          db.query(otpQuery,[otp,expiryTime,user_id],async(err,result)=>{
            if(err)
            {
              return res.json({success:false,message:err.message})
            }
            console.log("user",user,result[0]);
            // //resend type
            // const mailOptions={
            //   from:process.env.GMAIL_USER,
            //   to:user.email,
            //   subject:"Verify Your Account",
            //    html: `
            //       <h3>OTP for Account Verification</h3>
            //       <p>Your OTP is: <b>${otp}</b>. Verify your account using this OTP.</p>
            //       <p>This OTP expires in 24 hours.</p>
            //     `
            // }
            //  resend.emails.send({mailOptions})
             

              const mailOptions = {
              from: process.env.GMAIL_USER,
              to: user.email,
              subject: "Verify Your Account",
              html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email),
            };
            await transporter.sendMail(mailOptions);
            return res.json({success:true,message:"OTP sent to email"})
          })
        })
    }
    catch (err)
    {
        res.json({success:false,message:err.message})
    }
}

export const getVerifyOtp= async (req,res)=>{
    const {user_id,otp}=req.body;
        if(!user_id || !otp)
        {
            return res.json({success:false,message:"Missing user_id or otp"})
        }
        
    try{
        const query="SELECT verifyOtp,otp_expiry,isAccountVerified FROM users WHERE user_id=?";
        db.query(query,[user_id],async(err,result)=>{
            if(err)
            {
                return res.json({success:false,message:err.message})
            }
            if(result.length === 0)
            {
                return res.json({success:false,message:"User not found"})
            }

           const  user=result[0];
           if(user.isAccountVerified === 1)
            {
                return res.json({success:false,message:"Account already verified"})
            }
            if(!user.verifyOtp  || user.verifyOtp !== String(otp))
        {
            return res.json({success:false,message:"Invalid OTP"})
        }

        if(new Date(user.otp_expiry) < new Date())
        {
            return res.json({success:false,message:"OTP expired"})
        }

        user.isAccountVerified = 1;
        const updateQuery = "UPDATE users SET  isAccountVerified=1, verifyOtp='', otp_expiry='' WHERE user_id=?";
        db.query(updateQuery,[user_id],async(err,result)=>{
            if(err)
            {
                return res.json({success:false,message:err.message})
            }
            return res.json({success:true,message:"Account verified successfully"})
        })
        console.log("DB OTP:", user.verifyOtp);
console.log("Entered OTP:", otp);


    })
        
    }
    catch (error) {
  console.log("JWT VERIFY ERROR:", error.message);
  return res.json({
    success: false,
    message: error.message,
  });
}

}

//verify user is authenticated
export const isAuthenticated=async(req,res)=>{
  try{
    return res.json({success:true})
  }
  catch(error)
  {
    return res.json({success:false,message:error.message})
  }
}


//send password reset otp
export const sendResetOtp= async(req,res)=>{
  const {email}=req.body;
  if(!email)
  {
    return res.json({success:false,message:"Email is required"})
  }

  try{
       const getUser = "SELECT user_id,email FROM users WHERE email=?";
       db.query(getUser,[email],async(err,result)=>{
        if (err) {
        return res.json({
          success: false,
          message: err.message,
        });
      }
        if(result.length === 0)
        {
            return res.json({success:false,message:"User not found"})
        }
        const user=result[0];
        const otp= String(Math.floor(100000 + Math.random()*900000));
        const expiryTime= new Date(Date.now() + 15*60*1000); //15 minutes
        const otpQuery="UPDATE users SET resetOtp=?,resetOtp_expiry=? WHERE user_id=?";
        db.query(otpQuery,[otp,expiryTime,user.user_id],async(err,result)=>{
            if(err)
            {
                return res.json({success:false,message:err.message})
            }
             console.log("Reset OTP:", otp);
            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: user.email,
                subject: "Password Reset OTP",
                html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
                // html: `
                //   <h3>Your OTP for Password Resetting is <b>${otp}</b></h3>
                //   <p>Use this OTP to reset your password. It will expire in 15 minutes.</p>`
            }
            await transporter.sendMail(mailOptions);
            return res.json({success:true,message:"Reset OTP sent to mail successfully"})
        })
       })
  }
  catch(error)
  {
    return res.json({success:false,message:error.message})
  }
}


//Reset user password using otp
export const resetPasswordWithOtp= async(req,res)=>{
  const {email,otp,newPassword}=req.body;
  if(!email || !otp || !newPassword)
  {
    return res.json({success:false,message:"Missing email, otp or new password"})
  }

  try{
        const query="SELECT user_id,resetOtp,resetOtp_expiry FROM users WHERE email=?";
        db.query(query,[email],async(err,result)=>{
            if(err)
            {
                return res.json({success:false,message:err.message})
            }
            if(result.length === 0)
            {
                return res.json({success:false,message:"User not found"})
            }
            const user=result[0];
            
      console.log("DB OTP:", user.resetOtp);
      console.log("Entered OTP:", otp);
            if(user.resetOtp === '' || user.resetOtp !== String(otp))
            {
                return res.json({success:false,message:"Invalid OTP"})
            }

            if(new Date(user.resetOtp_expiry) < new Date())
            {
                return res.json({success:false,message:"OTP expired"})
            }
                
                const hashedPassword=await bcrypt.hash(newPassword,10);
    
                const updateQuery="UPDATE users SET password=?,resetOtp='',resetOtp_expiry='' WHERE user_id=?";
                db.query(updateQuery,[hashedPassword,user.user_id],async(err,result)=>{
                    if(err)
                    {
                        return res.json({success:false,message:err.message})
                    }
                    return res.json({success:true,message:"Password reset successfully"})
                })
            })
        
  }
  catch(error)
  {
    return res.json({success:false,message:error.message})
  }
}


//multer file upload api
export const singleFileUpload =async(req,res)=>{
 try {
   if(!req.file)
  {
    return res.json({success:false,message:"No file uploaded"});
  }
  console.log(req.file);
  const user_id=req.userId;
  const { originalname, mimetype, path } = req.file;
  const query=`INSERT INTO file (user_id,name,mimetype,path) VALUES(?,?,?,?)`;
  
  db.query(query,[user_id,originalname,mimetype,path],(err,data)=>{
    if (err) {
      console.log("DB Error", err);
      return res.json({ success: false, message: err.message });
    }
    return res.json({ success: true, message: "File uploaded successfully" });
  })
 } catch (error) {
  if (error.code === "LIMIT_FILE_SIZE") {
      return res.json({
        success: false,
        message: "File size exceeds 5MB limit"
      });
    }

    return res.json({
      success: false,
      message: "Something went wrong"
    });
 }
  
}


export const getUploadedFile = async(req,res)=>{
  const user_id=req.userId;
  const query=`select * from file where user_id=?`;
  db.query(query,[user_id],(err,data)=>{
    if(err){
      return res.json({success:false,message:err.message});
    }
    else{
      return res.json({success:true,files:data});
    }
  })
}

//Task

//create task
export const createTask = async(req,res)=>{
    const {title,description,status,reported_to} = req.body;
    const user_id=req.userId;
    const query = "Insert into task (title,description,status,reported_to,user_id) values (?,?,?,?,?)";
    db.query(query,[title,description,status,reported_to,user_id],(err,result)=>{
      if(err)
      {
        return res.json({success:false,message:"Error-"+err.message})
      }
      else
      {
        return res.json({
          success:true,
          message:"Task Created successfully!"
        });
      }
    })
}

//Get all task
export const getAllTask = async(req,res)=>{
  const user_id = req.userId;
  const query = "Select * from task where user_id=?";
  db.query(query,[user_id],(err,result)=>{
    if(!user_id)
    {
      return res.json({
        success:false,
        message:"User doesnt exist"
      });
    }
    else if(err)
    {
      return res.json(
        {
          success:false,
          message:err.message
        }
      )
    }
    else{
      return res.json({
        success:true,
        message:result
      })
    }
  })
}

//update task
export const updateTask=async(req,res)=>{
  const {title,description,status,reported_to,task_id} = req.body;

  const query = "update task set title=?,description=?,status=?,reported_to=? where task_id=?"

  db.query(query,[title,description,status,reported_to,task_id],(err,result)=>{
    if(err)
    {
      return res.json({
        success:false,
        message:err.message
      })
    }
    else
    {
      return res.json({
        success:true,
        message:"Task updated" + result
      })
    }
  })

}

// Delete task
export const deleteTask = (req,res)=>{
    const {task_id}=req.body;

    const query="DELETE FROM task WHERE task_id=?";

    db.query(query,[task_id],(err)=>{
        if(err){
            return res.json({success:false,message:err.message});
        }

        return res.json({
            success:true,
            message:"Task deleted"
        });
    });
}


export const dbTest = (req,res)=>{
  db.query("select 1",(err,result)=>{
    if(err){
      return res.json({success:false,message:err.message});
    }
    else{
      return res.json({success:true,message:"Database connection successful"});
    }
  })
}