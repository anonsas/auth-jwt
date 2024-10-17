import { createBrowserRouter } from "react-router-dom";
import { HomePage, RegisterPage } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
