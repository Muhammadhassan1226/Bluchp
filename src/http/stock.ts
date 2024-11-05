import axios from "axios";

// test
export const Fetchstockdata = async () => {
  const response = await axios.get(
    `https://financialmodelingprep.com/api/v3/search?query=AA&apikey=${process.env.VITE_API_KEY}`
  );

  return response.data;
};

export const DashboardStockdata = async () => {
  const response = await axios.get(
    `https://financialmodelingprep.com/api/v3/stock-screener?apikey=${process.env.VITE_API_KEY}`
  );

  return response.data;
};

export const RecentGaines = async () => {
  const response = await axios.get(
    `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${process.env.VITE_API_KEY}`
  );

  return response.data;
};

export const Sidebarapi = async () => {
  const response = await axios.get(
    `https://financialmodelingprep.com/api/v3/stock/list?apikey=${process.env.VITE_API_KEY_TWO}`
  );

  return response.data;
};
