import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";
import { router } from "./router.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const qeryclient = new QueryClient();
const persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <QueryClientProvider client={qeryclient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <ChakraProvider>
          <PersistGate persistor={persistor}>
            <RouterProvider router={router} />
          </PersistGate>
        </ChakraProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </Provider>
);
