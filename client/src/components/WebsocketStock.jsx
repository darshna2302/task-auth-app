import { useEffect, useState } from "react";

function WebsocketStock() {

  const [stock, setStock] = useState({
    name: "",
    price: ""
  });

  useEffect(() => {

    const socket = new WebSocket("ws://localhost:5000/web-socket-stock");

    socket.onopen = () => {
      // console.log("Connected to WebSocket server");
      socket.send("Client connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStock(data);
    };

    socket.onerror = (error) => {
      // console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      // console.log("WebSocket disconnected");
    };

    return () => socket.close();

  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-8 w-80 text-center">

        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Live Stock Price (WebSocket)
        </h1>

        <div className="text-xl font-semibold text-red-600">
          {stock.name}
        </div>

        <div className="text-3xl font-bold text-green-500 mt-2">
          ${stock.price}
        </div>

      </div>

    </div>
  );
}

export default WebsocketStock;