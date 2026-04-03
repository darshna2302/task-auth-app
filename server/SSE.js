import express from"express";
import cors from "cors";

const app=express();
app.use(cors());

app.get("/stocks",(req,res) => {
    res.setHeader("Content-Type","text/event-stream");
    res.setHeader("Catche-Control","no-cache");
    res.setHeader("Connection","keep-alive");

const interval= setInterval(()=>{
    const stock={
        name:"Apple",
         price: (100 + Math.random() * 10).toFixed(2)
    };

    res.write(`data: ${JSON.stringify(stock)}\n\n`);

  }, 2000);

  req.on("close", () => {
    clearInterval(interval);
  });
    
})

app.listen(5000, () => {
  console.log("SSE server running");
});