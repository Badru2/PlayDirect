import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import UserNavigation from "../../components/navigations/user-navigation";
import { Link, useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState("");
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchUserIdAndWishlist = async () => {
    if (user?.email) {
      try {
        const userResponse = await axios.get(
          `/api/admin/get/id?email=${user.email}`
        );
        const fetchedUserId = userResponse.data.id;
        setUserId(fetchedUserId);

        if (fetchedUserId) {
          const wishlistResponse = await axios.get(
            `/api/wishlist/show?userId=${fetchedUserId}`
          );
          const wishlistItemsData = wishlistResponse.data;

          console.log("wishlistItemsData", wishlistItemsData);
          // Ensure that the response is an array
          setWishlists(wishlistItemsData);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setError("Failed to fetch wishlist.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserIdAndWishlist();
  }, [user]);

  // Redirect to login if user is not authenticated
  if (!user) {
    return navigate("/login");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <UserNavigation />
      <div className="flex max-w-7xl mx-auto space-x-3 p-3">
        <div className="w-full bg-white shadow-md">
          <div className="font-bold p-4">Wishlist</div>
          {error && <p className="text-red-500">{error}</p>}
          {wishlists.length === 0 ? (
            <p className="p-4">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlists.map((wishlist) => {
                const product = wishlist.Product;
                return (
                  <div
                    key={wishlist.product_id}
                    className="rounded-lg p-6 mb-4"
                  >
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={`/images/products/${product.images[0]}`}
                        alt={product.name}
                        className="w-full h-40 object-cover mb-4"
                      />
                    </Link>
                    <h2 className="text-lg font-bold mb-2">
                      <Link to={`/product/${product.id}`}>{product.name}</Link>
                    </h2>
                    <p className="text-gray-600 mb-2">
                      Price:{" "}
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(product.price)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
