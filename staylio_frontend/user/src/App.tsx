import { RouterProvider } from "react-router-dom";
import { routers } from "./routers/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "../../common/contexts/ChatContext";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ChatProvider>
      <Toaster position="top-center" />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routers} />
      </QueryClientProvider>
    </ChatProvider>
  );
}

