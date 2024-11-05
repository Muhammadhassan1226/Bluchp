import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const Register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    return api.post("/api/v1/auth/register", data);
  } catch (e: any) {
    if (e.response) {
      // Server responded with a status other than 200 range
      throw e.response.data; // Directly throw the data part of the error
    }
  }
};

export const Logout = async () => {
  return api.post("/api/v1/auth/logout");
};

export const LoginFn = async (data: { email: string; password: string }) => {
  return api.post("/api/v1/auth/login", data);
};

export const emailVerify = async (data: { email: string }) => {
  return api.post("/api/v1/otp", data);
};

export const otpVerify = async (data: { otp: string; email: string }) => {
  return api.post("/api/v1/otp/verify", data);
};

export const resetPssword = async (data: {
  password: string;
  email: string;
}) => {
  try {
    return api.post("/api/v1/otp/reset", data);
  } catch (e: any) {
    if (e.response) {
      // Server responded with a status other than 200 range
      throw e.response.data; // Directly throw the data part of the error
    }
  }
};
