import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const UserNavigation = () => {
  const { user, logout } = useAuth();
  return (
    <div className="w-full bg-red-600 py-3 px-2 flex justify-between text-white shadow-md sticky top-0 z-50">
      <div className="font-bold stroke-black stroke-1 ">
        <Link to={"/"}>
          Play<span>Direct</span>
        </Link>
      </div>
      <div className="flex space-x-4 items-center">
        <div>
          <Link to={user ? "/cart" : "/login"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 32 32"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              >
                <path d="M6 6h24l-3 13H9m18 4H10L5 2H2"></path>
                <circle cx={25} cy={27} r={2}></circle>
                <circle cx={12} cy={27} r={2}></circle>
              </g>
            </svg>
          </Link>
        </div>
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
