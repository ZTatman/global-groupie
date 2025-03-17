import React from "react";
import ReactDOM from "react-dom/client";
import "@/css/index.css";
import App from "@components/app.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" position="left" />
        </QueryClientProvider>
    </React.StrictMode>
);
