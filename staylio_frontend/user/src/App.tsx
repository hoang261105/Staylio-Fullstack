import { RouterProvider } from "react-router-dom";
import { routers } from "./routers/routes";

export default function App() {
  return <RouterProvider router={routers} />;
}
