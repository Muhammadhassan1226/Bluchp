import { useQuery } from "@tanstack/react-query";
import { Fetchstockdata } from "@/http/stock";
import { Stock } from "@/types/stock";
import { useEffect, useState } from "react";
import "@/index.css";
import { FaPause, FaPlay } from "react-icons/fa";
import { LoaderCircle } from "lucide-react";
import { Stocksdummydata } from "@/data/stocks";
const Stockapi = () => {
  const { data: stock } = useQuery<Stock[]>({
    queryKey: ["stock"],
    queryFn: Fetchstockdata,
    staleTime: 120000,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const displayStock = stock && stock.length > 0 ? stock : Stocksdummydata;

  useEffect(() => {
    let intervalId: any;

    if (!isPaused && displayStock && displayStock.length > 0) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === displayStock.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000); // Adjust the interval as needed for your animation speed
    }

    return () => clearInterval(intervalId);
  }, [isPaused, displayStock]);

  if (!displayStock) return <LoaderCircle size={20} className="animate-spin" />;

  const handlePauseResume = () => {
    setIsPaused((prevPaused) => !prevPaused);
  };
  return (
    <div className="relative">
      <div className="overflow-y-auto bg-gray-800 dark:bg-black text-white py-2">
        <div className="flex justify-center items-center h-6 relative">
          {displayStock.map((stockItem, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-48 mx-auto text-center transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                transition: "opacity 1s ease-in-out",
              }}
            >
              <div className="flex flex-row gap-4 justify-center items-center px-4">
                <p>{stockItem.symbol}</p>
                <p>{stockItem.exchangeShortName}</p>
                <p>{stockItem.currency}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handlePauseResume}
        className="absolute top-1 right-2  text-white font-bold py-2 px-4 rounded"
      >
        {isPaused ? <FaPlay /> : <FaPause />}
      </button>
    </div>
  );
};

export default Stockapi;
