import { useEffect, useState } from "react";

function StockSSE() {
  const [stock, setStock] = useState({});

  useEffect(() => {
    const source = new EventSource("http://localhost:5000/stocks");

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStock(data);
    };

    return () => source.close();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-xl p-8 w-80 text-center">

        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Live Stock Price
        </h1>

        <div className="text-xl font-semibold text-red-600">
          <span>{stock.name}</span>
        </div>

        <div className="text-3xl font-bold text-green-500 mt-2">
          ${stock.price}
        </div>

      </div>

    </div>
  );
}

export default StockSSE;