import { createBrowserRouter, RouteObject } from "react-router-dom";
import { HomePage, RegisterPage, LoginPage, UsersPage } from "../pages";
import { Layout } from "./Layout/Layout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: routes,
  },
]);
