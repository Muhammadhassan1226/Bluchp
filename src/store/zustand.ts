import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Tokenstore {
  token: string;
  setToken: (data: string) => void;
}
export interface DateStore {
  createddate: string;
  setCreateddate: (data: string) => void;
}

const useToken = create<Tokenstore>()(
  devtools(
    persist(
      (set) => ({
        token: "",
        setToken: (data: string) => set(() => ({ token: data })),
      }),
      { name: "token-store" }
    )
  )
);
export const useDate = create<DateStore>()(
  devtools(
    persist(
      (set) => ({
        createddate: "",
        setCreateddate: (data: string) => set(() => ({ createddate: data })),
      }),
      { name: "date-store" }
    )
  )
);

export default useToken;
