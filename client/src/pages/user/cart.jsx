import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import UserNavigation from "../../components/navigations/user-navigation";

const Cart = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState(user?.id || "");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({}); // Use an object for product details

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

  const fetchCart = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(`/api/cart/show?userId=${userId}`);
      const cartItems = response.data;
      cartItems.sort((a, b) => a.created_at - b.created_at);

      setCartItems(cartItems);

      if (cartItems.length > 0) {
        await fetchProducts(cartItems);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const fetchProducts = async (carts) => {
    const productIds = carts.map((cart) => cart.product_id);

    try {
      const response = await axios.get(
        `/api/product/show?ids=${productIds.join(",")}`
      );
      const productsArray = response.data;

      // Sort products by name
      productsArray.sort((a, b) => a.name.localeCompare(b.name));

      // Create a dictionary of products by their ID
      const productsById = productsArray.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});

      setProducts(productsById);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const updateQuantity = async (productId, currentQuantity, action) => {
    try {
      const newQuantity =
        action === "increase"
          ? currentQuantity + 1
          : Math.max(currentQuantity - 1, 1);

      await axios.put(`/api/cart/update`, {
        userId,
        productId,
        quantity: newQuantity,
      });

      // Refresh cart after updating quantity
      fetchCart();
    } catch (error) {
      console.error(
        `Error ${action === "increase" ? "adding" : "removing"} cart quantity:`,
        error
      );
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  return (
    <div>
      <UserNavigation />
      <h1>Cart</h1>
      <div className="space-y-4">
        {cartItems.map((cart) => {
          const product = products[cart.product_id];
          if (!product) {
            return (
              <div key={cart.product_id} className="flex space-x-3">
                <div>Loading product details...</div>
              </div>
            );
          }

          const totalPrice = product.price * cart.quantity;

          return (
            <div key={cart.product_id} className="flex space-x-3 p-4 border-b">
              <div>
                <img
                  src={`/images/products/${product.images[0]}`}
                  alt={product.name}
                  className="w-20 h-20 object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center px-4">
                <p className="text-lg font-semibold">{product.name}</p>
                <p className="text-gray-600">
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(totalPrice)}
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      updateQuantity(product.id, cart.quantity, "increase")
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    +
                  </button>
                  <p className="text-gray-500">Quantity: {cart.quantity}</p>
                  <button
                    onClick={() =>
                      updateQuantity(product.id, cart.quantity, "decrease")
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cart;
