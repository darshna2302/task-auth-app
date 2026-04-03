import nodemailer from "nodemailer"
import dotenv from "dotenv";
//create brevo smtp transporter
// const transporter= nodemailer.createTransport({
//     host: process.env.SMTP_HOST,//smtp host
//     port: process.env.SMTP_PORT,//smtp port
//     secure: false,
//     auth:{
//         user: process.env.SMTP_USER,// smtp auth email
//         pass: process.env.SMTP_PASS// amtp auth password
//     }
// })

// create google smtp 
dotenv.config();
const transporter= nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
})


export default transporter;

// import { Resend } from 'resend';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default resend;