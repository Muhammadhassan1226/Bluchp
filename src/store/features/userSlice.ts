import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  username: string;
  password: string;
  email: string;
  followers: [];
  following: [];
  profileImg: string;
  bio?: string;
  googleId: string;
  _v: number;
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export default userSlice;
export const { setUser } = userSlice.actions;
