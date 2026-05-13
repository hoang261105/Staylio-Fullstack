import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { routers } from "./routers/routers";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routers} />
      </QueryClientProvider>
      ;
    </>
  );
}
