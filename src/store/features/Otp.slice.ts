import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface OTP {
  _id: string;
  verified: boolean;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  __v: number;
}

interface OTPState {
  otp: OTP | null;
}

const initialState: OTPState = {
  otp: null,
};

export const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    setOTP: (state, action: PayloadAction<OTP>) => {
      state.otp = action.payload;
    },
  },
});

export default otpSlice;
export const { setOTP } = otpSlice.actions;
