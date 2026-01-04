import { Outlet, NavLink } from "react-router-dom";
import NavBar from "../common/NavBar";

const AuthLayout = () => {
  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-12">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AuthLayout;
