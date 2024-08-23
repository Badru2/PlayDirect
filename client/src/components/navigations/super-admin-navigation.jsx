import React from "react";
import { useAuth } from "../../hooks/useAuth";

const SuperAdminNavigation = () => {
  const { user, logout } = useAuth();
  return (
    <div className="w-full py-3 bg-blue-400 px-2 flex justify-between">
      <div>Super Admin Navigation</div>
      <div>
        {user ? (
          <button onClick={logout} className="bg-red-500 text-white  rounded">
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
