import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, NavLink } from "react-router-dom";

const SuperAdminNavigation = () => {
  const { user, logout } = useAuth();

  const where = [
    {
      name: "Dashboard",
      path: "/superAdmin/dashboard",
    },
    {
      name: "Admin",
      path: "/superAdmin/admin",
    },
    {
      name: "Transaction",
      path: "/superAdmin/transaction",
    },
  ];

  const active = "text-xl font-bold border-e-4 border-blue-500 text-blue-500 ";
  const inactive =
    "text-xl hover:border-e-4 hover:border-blue-500 delay-75 transition duration-300";

  return (
    <div>
      <div className="w-1/5 h-screen p-3 bg-white flex flex-col justify-between shadow-lg z-10 fixed">
        <div className="space-y-9">
          <div className="font-bold text-2xl">PlayDirect</div>

          <div className="flex flex-col space-y-3 mt-5">
            {where.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => (isActive ? active : inactive)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white  w-full py-2 font-bold"
            >
              Logout
            </button>
          ) : (
            <a href="/login" className="text-blue-500">
              Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminNavigation;
