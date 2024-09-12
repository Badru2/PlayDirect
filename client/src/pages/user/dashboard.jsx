import React, { useEffect, useState } from "react";
import UserNavigation from "../../components/navigations/user-navigation";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";

const UserDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(user?.id || "");
  const [wishlist, setWishlist] = useState([]); // State to hold wishlist items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`/api/admin/get/id?email=${user.email}`)
        .then((response) => setUserId(response.data.id))
        .catch((err) => {
          console.error("Error fetching user ID:", err);
        });
    }
  }, [user]);

  // Fetch product data
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product/show");
      let products = response.data;

      // Sort products by creation date
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      products = products.slice(0, 12);

      setProducts(products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (userId) {
      try {
        const response = await axios.get(`/api/wishlist/${userId}`);
        setWishlist(response.data); // Assuming the API returns an array of product IDs
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist(); // Fetch wishlist when userId is available
  }, [userId]);

  const handleAddToCart = async ({ productId }) => {
    try {
      const response = await axios.post("/api/cart/add", {
        userId,
        productId,
        quantity: 1,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        // Remove from wishlist
        await axios.delete(`/api/wishlist/delete/${userId}/${productId}`);
        setWishlist(wishlist.filter((id) => id !== productId));
      } else {
        // Add to wishlist
        await axios.post("/api/wishlist/create", {
          userId,
          productId,
        });
        setWishlist([...wishlist, productId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <div>
      <UserNavigation />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="mx-auto max-w-7xl mt-4 space-y-4">
          <div>
            <div
              id="default-carousel"
              className="relative w-full"
              data-carousel="slide"
            >
              <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                <div
                  className="hidden duration-700 ease-in-out"
                  data-carousel-item
                >
                  <img
                    src="/public/images/products/1726028243108-OIP (5).jpeg"
                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </div>

                <div
                  className="hidden duration-700 ease-in-out"
                  data-carousel-item
                >
                  <img
                    src="/public/images/products/1726028243108-OIP (5).jpeg"
                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </div>

                <div
                  className="hidden duration-700 ease-in-out"
                  data-carousel-item
                >
                  <img
                    src="/public/images/products/1726028243108-OIP (5).jpeg"
                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </div>

                <div
                  className="hidden duration-700 ease-in-out"
                  data-carousel-item
                >
                  <img
                    src="/public/images/products/1726028243108-OIP (5).jpeg"
                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </div>

                <div
                  className="hidden duration-700 ease-in-out"
                  data-carousel-item
                >
                  <img
                    src="/public/images/products/1726028243108-OIP (5).jpeg"
                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt="..."
                  />
                </div>
              </div>

              <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                <button
                  type="button"
                  className="w-3 h-3 rounded-full"
                  aria-current="true"
                  aria-label="Slide 1"
                  data-carousel-slide-to="0"
                ></button>
                <button
                  type="button"
                  className="w-3 h-3 rounded-full"
                  aria-current="false"
                  aria-label="Slide 2"
                  data-carousel-slide-to="1"
                ></button>
                <button
                  type="button"
                  className="w-3 h-3 rounded-full"
                  aria-current="false"
                  aria-label="Slide 3"
                  data-carousel-slide-to="2"
                ></button>
                <button
                  type="button"
                  className="w-3 h-3 rounded-full"
                  aria-current="false"
                  aria-label="Slide 4"
                  data-carousel-slide-to="3"
                ></button>
                <button
                  type="button"
                  className="w-3 h-3 rounded-full"
                  aria-current="false"
                  aria-label="Slide 5"
                  data-carousel-slide-to="4"
                ></button>
              </div>

              <button
                type="button"
                className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-prev
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                  <span className="sr-only">Previous</span>
                </span>
              </button>
              <button
                type="button"
                className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-next
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                  <svg
                    className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="sr-only">Next</span>
                </span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-6 grid-cols-2 gap-4 m-3 lg:m-0">
            {products.map((product) => {
              // Format the price to Indonesian Rupiah currency
              const formattedPrice = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price);

              const isInWishlist = wishlist.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="shadow-md w-full bg-white rounded-sm mx-auto"
                >
                  <div className="carousel w-full bg-blue-200">
                    {product.images.map((image, index) => (
                      <div
                        key={index}
                        className="carousel-item relative w-full"
                      >
                        <img
                          src={`/public/images/products/${image}`}
                          alt={product.name}
                          className="w-full object-cover lg:h-48 sm:h-80"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="px-3 pb-3">
                    <Link to={`/product/${product.id}`}>
                      <p>{product.name}</p>
                    </Link>
                    <b>{formattedPrice}</b>

                    {/* Heart icon for wishlist */}
                    <div className="flex justify-between pt-3">
                      <button
                        onClick={() =>
                          user ? toggleWishlist(product.id) : navigate("/login")
                        }
                        className="wishlist-button"
                      >
                        <FontAwesomeIcon
                          icon={isInWishlist ? solidHeart : regularHeart}
                          color={isInWishlist ? "red" : "gray"}
                        />
                      </button>
                      <button
                        onClick={
                          user
                            ? () => handleAddToCart({ productId: product.id })
                            : () => navigate("/login")
                        }
                        className="bg-green-400 px-5 text-white font-bold rounded-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
