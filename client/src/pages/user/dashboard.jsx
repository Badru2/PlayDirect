import React, { useEffect, useRef, useState } from "react";
import UserNavigation from "../../components/navigations/user-navigation";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const UserDashboard = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState(user?.id || "");
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]); // State to hold wishlist items
  const [carousel, setCarousel] = useState([]); // State to hold carousel items
  const [consoleProduct, setConsoleProduct] = useState([]);

  const topRef = useRef(null);

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

  const fetchCarousel = async () => {
    try {
      const response = await axios.get("/api/carousel/show");

      console.log(response.data);
      setCarousel(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching carousel:", error);
    }
  };

  const fetchConsoleProduct = async () => {
    try {
      const response = await axios.get("/api/product/show");
      const filtered = response.data.filter(
        (product) => product.category_id === 2
      );

      console.log("console", filtered);
      setConsoleProduct(filtered);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching console products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch product
    fetchConsoleProduct(); // Fetch console products
    fetchWishlist(); // Fetch wishlist when userId is available
    fetchCarousel();
    topRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const LoadingComponent = () => (
    <div className="mx-auto max-w-7xl mt-4 space-y-4">
      <div>
        <div className="w-full h-64 md:h-96 bg-gray-500 animate-pulse" />
      </div>

      <div className="grid lg:grid-cols-6 grid-cols-2 gap-4 m-3 lg:m-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`animate-pulse h-52 rounded-md my-3 bg-gray-400 space-y-2`}
          >
            <div className="w-full h-40 bg-gray-500 animate-pulse" />
            <div className="w-3/4 mx-3 h-4 rounded-full bg-gray-500 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div ref={topRef} className="top-0 absolute z-[-10]" />
      <UserNavigation />
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="mx-auto max-w-7xl mt-4 space-y-4 mb-6">
          {/* Carousel */}
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            effect={"fade"}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
          >
            {carousel.map((item) => (
              <SwiperSlide key={item.id}>
                <img
                  src={`/public/images/carousel/${item.image}`}
                  alt={item.description}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* New On PlayDirect */}
          <div className="space-y-3">
            <h1 className="md:text-3xl px-3 md:px-0 text-2xl font-bold">
              New On PlayDirect:
            </h1>
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
                    <div
                      to={`/product/${product.id}`}
                      className="w-full mb-2 bg-blue-200"
                    >
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={`/public/images/products/${product.images[0]}`}
                          alt={product.name}
                          className="w-full object-cover lg:h-48 sm:h-80"
                        />
                      </Link>
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
                            user
                              ? toggleWishlist(product.id)
                              : navigate("/login")
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

          {/* Consoles */}
          <div className="space-y-3 p-3 md:p-0">
            <div className="text-2xl font-bold">Consoles:</div>
            <div className="flex overflow-x-auto scrollbar w-full space-x-4">
              {consoleProduct.map((product) => {
                // Format the price to Indonesian Rupiah currency
                const formattedPrice = new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(product.price);

                const isInWishlist = wishlist.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="shadow-md w-52 bg-white rounded-sm flex-shrink-0"
                  >
                    <div className="mb-2 w-full bg-blue-200">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={`/public/images/products/${product.images[0]}`}
                          alt={product.name}
                          className="w-full object-cover lg:h-48 sm:h-80 min-h-52"
                        />
                      </Link>
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
                            user
                              ? toggleWishlist(product.id)
                              : navigate("/login")
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
              <Link className="flex-shrink-0 w-52  bg-white shadow-md flex flex-col items-center justify-center">
                <div className="p-10 bg-green-500 text-white font-bold rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="m8.75 3.25l4.5 4.5l-4.5 4.5m-6-4.5h10.5"
                    />
                  </svg>
                </div>
                <div className="font-bold text-2xl">More</div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
