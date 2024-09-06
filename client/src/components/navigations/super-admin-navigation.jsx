import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const SuperAdminNavigation = () => {
  const { user, logout } = useAuth();
  return (
    <div className="w-1/5 h-screen p-3 bg-white flex flex-col justify-between shadow-lg z-10 fixed">
      <div className="space-y-9">
        <div className="font-bold text-2xl">PlayDirect</div>

        <div className="space-y-5">
          <div>
            <Link to={"/superAdmin/dashboard"}>
              <div className="text-xl">Dashboard</div>
            </Link>
          </div>

          <div>
            <Link to="/superAdmin/admin">
              <div className="text-xl">Admin</div>
            </Link>
          </div>

          <div>
            <Link>
              <div className="text-xl">Transaction</div>
            </Link>
          </div>
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
  );
};

export default SuperAdminNavigation;
