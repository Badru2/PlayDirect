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
      <div className="mx-auto max-w-7xl mt-4">
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
                className="shadow-md bg-white rounded-sm mx-auto"
              >
                <div className="carousel w-full bg-blue-200">
                  {product.images.map((image, index) => (
                    <div key={index} className="carousel-item relative w-full">
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
                  <div className="flex justify-between">
                    <button
                      onClick={
                        user
                          ? () => handleAddToCart({ productId: product.id })
                          : () => navigate("/login")
                      }
                    >
                      Add to Cart
                    </button>
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
                  </div>

                  {/* Display cart quantity if it exists */}
                  {product.Carts && product.Carts.length > 0 && (
                    <p>In Cart: {product.Carts[0].quantity}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
