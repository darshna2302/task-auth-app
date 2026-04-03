import {WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 5000,path:"/web-socket-stock" });

wss.on("connection", (ws) => {

  console.log("Client connected");

  const interval = setInterval(() => {

    const stock = {
      name: "APPLE",
      price: (100 + Math.random() * 10).toFixed(2)
    };

    ws.send(JSON.stringify(stock));

  }, 2000);

  ws.on("message", (msg) => {
    console.log("Client message:", msg.toString());
  });

  ws.on("close", () => {
    clearInterval(interval);
  });

});