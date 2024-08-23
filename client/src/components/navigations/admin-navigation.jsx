import React from "react";
import { useAuth } from "../../hooks/useAuth";

const AdminNavigation = () => {
  const { user, logout } = useAuth();
  return (
    <div className="bg-yellow-500 w-full py-3 px-2 flex justify-between">
      <div>Admin Navigation</div>
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

export default AdminNavigation;
