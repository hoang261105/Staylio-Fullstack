import { RouterProvider } from "react-router-dom";
import { routers } from "./routers/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "../../common/contexts/ChatContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "118146961643-tirpb2rd9vcjcbtphk3s58e4o75jr7rn.apps.googleusercontent.com";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ChatProvider>
        <Toaster position="top-center" />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={routers} />
        </QueryClientProvider>
      </ChatProvider>
    </GoogleOAuthProvider>
  );
}

