import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export interface Google {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
}

interface gUser {
  guser: Google | null;
}

const initialState: gUser = {
  guser: null,
};

export const guserSlice = createSlice({
  name: "guser",
  initialState,
  reducers: {
    setgUser: (state, action: PayloadAction<Google>) => {
      state.guser = action.payload;
    },
  },
});

export default guserSlice;
export const { setgUser } = guserSlice.actions;
