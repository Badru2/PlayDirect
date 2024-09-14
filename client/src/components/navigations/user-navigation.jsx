import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import axios from "axios";

const UserNavigation = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState("");

  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [debouncedProductName, setDebouncedProductName] = useState("");
  const [loading, setLoading] = useState(false); // For loading indicator
  const [error, setError] = useState(null); // For error handling

  const searchProduct = async () => {
    if (debouncedProductName.trim() === "") {
      setProducts([]); // Clear the search results if input is empty
      return;
    }
    setLoading(true); // Start loader
    try {
      const response = await axios.get(
        `/api/product/search?productName=${debouncedProductName}`
      );
      console.log("response.data", response.data);
      setProducts(response.data);
    } catch (error) {
      console.log("error", error);
      setError("Error fetching products");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/profile/show?email=${user.email}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProductName(productName);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [productName]);

  useEffect(() => {
    searchProduct();
  }, [debouncedProductName]);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="w-full bg-red-600 py-2 px-2 flex justify-between text-white shadow-md sticky top-0 z-50 items-center">
      <div className="max-w-[1440px] mx-auto flex w-full justify-between items-center">
        <div className="font-bold stroke-black stroke-1 text-xl">
          <Link to={"/"}>PlayDirect</Link>
        </div>

        {/* Search Product */}
        <div className="relative md:w-1/3">
          <div className="relative w-full flex items-center">
            <div className="absolute text-black left-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M15.096 5.904a6.5 6.5 0 1 0-9.192 9.192a6.5 6.5 0 0 0 9.192-9.192M4.49 4.49a8.5 8.5 0 0 1 12.686 11.272l5.345 5.345l-1.414 1.414l-5.345-5.345A8.501 8.501 0 0 1 4.49 4.49"
                />
              </svg>
            </div>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full text-black border-gray-300 rounded-md ps-9"
              placeholder="Search Product"
            />
          </div>

          {/* Show loading indicator */}
          {loading && (
            <div className="absolute left-0 right-0 bg-white text-black mt-1 p-2 rounded-md shadow-lg max-h-60 overflow-y-auto">
              Loading...
            </div>
          )}

          {/* Show search results */}
          {!loading && products.length > 0 && (
            <div className="absolute left-0 right-0 bg-white text-black mt-1 p-2 rounded-md shadow-lg max-h-60 overflow-y-auto flex flex-col">
              {products.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="p-2 hover:bg-gray-100 flex items-center"
                >
                  <img
                    src={`/public/images/products/${product.images[0]}`}
                    alt={product.name}
                    className="w-10 h-10 object-cover border-2 rounded-md me-3"
                  />
                  <div>
                    <div className="md:hidden block">
                      {product.name.length > 20
                        ? product.name.slice(0, 20) + "..."
                        : product.name}
                    </div>
                    <div className="md:block hidden">{product.name}</div>
                    <p className="ml-auto hidden md:block">
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Show error message */}
          {error && <div className="text-red-500">{error}</div>}
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
              className="dropdown-content bg-white text-black rounded-sm z-[1] w-52 p-2 shadow-lg flex flex-col space-y-3 mt-2"
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
    </div>
  );
};

export default UserNavigation;
