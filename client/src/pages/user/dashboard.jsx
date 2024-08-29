import React, { useEffect, useState } from "react";
import UserNavigation from "../../components/navigations/user-navigation";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(user?.id || "");

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`/api/admin/get/id?email=${user.email}`)
        .then((response) => setUserId(response.data.id))
        .catch((err) => {
          setError("Error fetching user ID");
          console.error("Error fetching user ID:", err);
        });
    }
  }, [user]);

  // Fetch product data
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/product/show");
      let products = response.data;

      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setProducts(products);
      // console.log(products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(userId);
    fetchProducts();
  }, []);

  const handleAddToCart = async ({ productId }) => {
    try {
      const response = await axios.post("/api/cart/add", {
        userId,
        productId,
        quantity: 1,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <UserNavigation />
      <div className="mx-auto max-w-7xl mt-4">
        <div className="grid grid-cols-6 gap-4">
          {products.map((product) => {
            // Format the price to Indonesian Rupiah currency
            const formattedPrice = new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(product.price);

            return (
              <div key={product.id} className="shadow-md bg-white rounded-sm">
                <div className="carousel w-full bg-blue-200">
                  {product.images.map((image, index) => (
                    <div key={index} className="carousel-item relative w-full">
                      <img
                        src={`/images/products/${image}`}
                        alt={product.name}
                        className="w-full object-cover h-48"
                      />
                    </div>
                  ))}
                </div>
                <div className="px-3 pb-3">
                  <Link to={`/product/${product.id}`}>
                    <p>{product.name}</p>
                  </Link>
                  <b>{formattedPrice}</b>
                  <button
                    onClick={() => handleAddToCart({ productId: product.id })}
                  >
                    Add to Cart
                  </button>
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
