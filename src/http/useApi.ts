import { useEffect } from "react";
import axios from "axios";
import useToken from "@/store/zustand";

// Create Zustand store for token management

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

// Custom hook to setup interceptors
export const ApiReq = () => {
  useEffect(() => {
    // Axios request interceptor
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = useToken.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  return axiosInstance;
};
