import multer from "multer"
import express from "express";
import cors from "cors"
import {fileURLToPath} from "url"
import path from "path";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


const app=express();

app.use(cors());
app.use("/uploadedFile",express.static(path.join(__dirname,"uploadedFile")))

// multer configuration 
const storage = multer.diskStorage({
    destination: (req,file,cb) => {  // cb - call back
        cb(null,"uploadedFile")   // uploads- directory name   
    },
    limits:{
        fileSize:5*1024 *1024
    },
    filename: (req,file,cb)=>{
        cb(null, file.originalname); //unique name
    }
});

//memory storage
const upload=multer({storage:storage})

export default upload;