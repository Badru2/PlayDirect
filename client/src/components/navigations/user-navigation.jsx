import React from "react";
import { useAuth } from "../../hooks/useAuth";

const UserNavigation = () => {
  const { user, logout } = useAuth();
  return (
    <div className="w-full bg-red-600 py-3 px-2 flex justify-between text-white shadow-md">
      <div className="font-bold stroke-black stroke-1 ">
        Play<span>Direct</span>
      </div>
      <div>
        {user ? (
          <button onClick={logout} className="bg-red-500 text-white rounded">
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

export default UserNavigation;
