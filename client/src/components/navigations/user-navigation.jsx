import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import axios from "axios";

const UserNavigation = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState("");

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/profile/show?email=${user.email}`);
      console.log(response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="w-full bg-red-600 py-3 px-2 flex justify-between text-white shadow-md sticky top-0 z-50 items-center">
      <div className="font-bold stroke-black stroke-1 ">
        <Link to={"/"}>PlayDirect</Link>
      </div>
      <div className="flex space-x-4 items-center">
        <Link to={user ? "/cart" : "/login"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
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

        <div className="dropdown dropdown-end">
          <img
            src={
              profile.avatar
                ? `/public/images/avatar/${profile.avatar}`
                : `https://ui-avatars.com/api/?name=${profile.username}` ||
                  `https://ui-avatars.com/api/?name=Anonymous`
            }
            alt=""
            className="w-8 h-8 rounded-full object-cover"
            tabIndex="0"
            role="button"
          />
          <div
            tabIndex="0"
            className="dropdown-content  bg-white text-black rounded-sm z-[1] w-52 p-2 shadow-lg flex flex-col space-y-3 mt-2"
          >
            <Link
              to={user ? "/order-list" : "/login"}
              className="hover:border-b delay-75 transition duration-300"
            >
              Purchase
            </Link>
            <Link
              to={user ? "/wishlist" : "/login"}
              className="hover:border-b delay-75 transition duration-300"
            >
              Wishlist
            </Link>
            <Link
              to={user ? "/profile" : "/login"}
              className="hover:border-b delay-75 transition duration-300"
            >
              Profile
            </Link>
            <div>
              {user ? (
                <button
                  onClick={logout}
                  className="bg-red-500 text-white rounded-sm w-full"
                >
                  Logout
                </button>
              ) : (
                <a href="/login" className="text-blue-500 rounded-sm w-full">
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNavigation;
