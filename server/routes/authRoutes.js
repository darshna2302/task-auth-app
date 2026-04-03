import express from "express"
import { createTask, deleteTask, forgotPassword, getAllTask, getUploadedFile, getVerifyOtp, isAuthenticated, login, logout, register, resetPassword, resetPasswordWithOtp, sendResetOtp, sendVerifyOtp, singleFileUpload, updateTask} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";
import upload from "../config/multer.js"


const authRouter=express.Router();
authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/send-verify-otp",userAuth,sendVerifyOtp);
authRouter.post("/verify-account",getVerifyOtp)
authRouter.get("/is-auth",isAuthenticated);
authRouter.post("/send-reset-otp",sendResetOtp);//get
authRouter.post("/reset-password-otp",resetPasswordWithOtp);

//file upload
authRouter.post("/file-upload",userAuth,upload.single("file"),singleFileUpload);

authRouter.get("/uploaded-file",userAuth,getUploadedFile)

authRouter.post("/create-user-task",userAuth,createTask);
authRouter.get("/get-user-task",userAuth,getAllTask);
authRouter.put("/update-user-task",userAuth,updateTask);
authRouter.delete("/delete-user-task",userAuth,deleteTask);

export default authRouter;