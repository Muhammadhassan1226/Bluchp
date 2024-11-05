// slices/likesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LikesState {
  likedPosts: string[];
}

const initialState: LikesState = {
  likedPosts: [], // Initial state, can be populated from local storage or API
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    addLike: (state, action: PayloadAction<string>) => {
      if (!state.likedPosts.includes(action.payload)) {
        state.likedPosts.push(action.payload);
      }
    },
    removeLike: (state, action: PayloadAction<string>) => {
      state.likedPosts = state.likedPosts.filter((id) => id !== action.payload);
    },
  },
});

export const { addLike, removeLike } = likesSlice.actions;
export default likesSlice;
