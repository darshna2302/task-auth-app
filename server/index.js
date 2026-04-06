import express from "express";
import multer from "multer"
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js";
import path from "path"
import { createServer } from "http";
import { WebSocketServer } from "ws";

dotenv.config();

connectDB();

//create express app
const app=express();
const port=process.env.PORT || 4000;

// const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175','http://localhost:3001','https://task-auth-frontend.onrender.com'];
// console.log("Allowed Origins:", allowedOrigins);
app.options("*", cors({
  credentials: true,
  origin: true
}));

//middleware
app.use(cors({
    credentials: true, 
    origin:true
}));
 //all req parsed as json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

 


app.use("/uploadedFile", express.static(path.join(process.cwd(), "uploadedFile")))

//api endpoint
app.get("/",(req,res)=>{
    res.send("API working");
});

app.use("/api/auth",authRouter);
app.use('/api/user',userRouter);


// app.get("/stocks", (req, res) => {

//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   console.log("Client connected to SSE");

//   const interval = setInterval(() => {

//     const stockData = {
//       symbol: "AAPL",
//       price: (150 + Math.random() * 10).toFixed(2),
//       change: (Math.random() * 2 - 1).toFixed(2),
//       time: new Date().toLocaleTimeString()
//     };

//     res.write(`data: ${JSON.stringify(stockData)}\n\n`);

//   }, 3000);

//   req.on("close", () => {
//     console.log("SSE client disconnected");
//     clearInterval(interval);
//   });

// });
// create server
const server =createServer(app);

// attach WebSocket to same server
const ws= new WebSocketServer({
    server,
    path:"/table"
})

// INITIAL TABLE DATA 

const tableData = [];

for (let i = 1; i <= 10; i++) {
  tableData.push({
    id: i,
    name: `User_${i}`,
    department: ["HR", "IT", "Finance", "Admin"][Math.floor(Math.random()*4)],
    score: Math.floor(Math.random()*100),
    status: Math.random() > 0.5 ? "Active" : "Inactive",
    lastUpdated: new Date().toLocaleTimeString()
  });
}

// WEBSOCKET CONNECTION
ws.on("connection",(socket)=>{

console.log("Client Connected to websocket server...");

// SEND FULL TABLE ONCE
    socket.send(JSON.stringify({
        type:"INITIAL_TABLE",
        payload:tableData
    }))

    /// Update only 1 row every 3 seconds 

  const interval = setInterval(() => {

    const index = Math.floor(Math.random() * tableData.length);

    tableData[index].score = Math.floor(Math.random()*100);

    tableData[index].status =
      Math.random() > 0.5 ? "Active" : "Inactive";

    tableData[index].lastUpdated =
      new Date().toLocaleTimeString();


    socket.send(JSON.stringify({
      type: "ROW_UPDATE",
      payload: tableData[index]
    }));

  },2000);

  socket.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

});

 // send random data every 3 seconds
//   const interval = setInterval(() => {
//     const randomData = {
//       id: Math.floor(Math.random() * 1000),
//       name: "User_" + Math.floor(Math.random() * 100),
//       score: Math.floor(Math.random() * 100),
//       status: Math.random() > 0.5 ? "Active" : "Inactive",
//       time: new Date().toLocaleTimeString()
//     };
// socket.send(JSON.stringify({
//       type: "TABLE_UPDATE",
//       payload: randomData
//     }));
//   },3000);

  
// socket.send(JSON.stringify({
//     type:"Welcome",
//     message:"Connected to webSocket server"
// }));

// socket.on("message",(message)=>{
//     const data =JSON.parse(message.toString());

//     if(data.type === "PING")
// {
//     socket.send(JSON.stringify({
//         type:"PONG",
//         message:"Server received PING"
//     }))
// }
// });

// socket.on("close",()=>{
//     console.log("Websocket client disconnected");
//     clearInterval(interval);
// })

// });


// app.listen(port,()=>{
//     console.log(`Server started on PORT:${port}`);
// })

server.listen(port,()=>{
    console.log(`Server + websocket running on port :${port}`);
})