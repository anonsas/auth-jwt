import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <>
      <Navbar />
      <main className="p-10 h-full min-h-full">
        <Outlet />
      </main>
    </>
  );
}
