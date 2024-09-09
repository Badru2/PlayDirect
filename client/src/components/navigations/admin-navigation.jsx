import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

const AdminNavigation = () => {
  const { user, logout } = useAuth();

  const where = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      name: "Products",
      path: "/admin/products",
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
  ];

  const active = "text-xl font-bold border-e-4 border-blue-500 text-blue-500 ";
  const inactive =
    "text-xl hover:border-e-4 hover:border-blue-500 delay-75 transition duration-300";

  return (
    <div className="w-1/5 py-3 px-2 flex flex-col justify-between bg-white shadow-md h-screen fixed">
      <div>
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
        <div>
          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 text-white rounded w-full py-2"
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

export default AdminNavigation;
