import dotenv from "dotenv"
dotenv.config();

import mysql from "mysql";

const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT
});
export const connectDB=()=>{
    db.connect((err)=>{
        if(err)
        {
            console.error("mysql connection failed",err.message);
        }
        else{
            console.log("mysql database connected");
        }
    })
}

export default db;