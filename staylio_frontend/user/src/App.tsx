import { RouterProvider } from "react-router-dom";
import { routers } from "./routers/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ChatProvider } from "../../common/contexts/ChatContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "148721644781-iun8k2fntp42qikof6l051q330d80m2k.apps.googleusercontent.com";

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

