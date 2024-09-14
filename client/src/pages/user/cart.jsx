import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import UserNavigation from "../../components/navigations/user-navigation";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false); // Update initial loading state
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchUserIdAndCart = async () => {
    setLoading(true); // Set loading true when fetching data
    if (user?.email) {
      try {
        const userResponse = await axios.get(
          `/api/admin/get/id?email=${user.email}`
        );
        const fetchedUserId = userResponse.data.id;
        setUserId(fetchedUserId);

        if (fetchedUserId) {
          const cartResponse = await axios.get(
            `/api/cart/show?userId=${fetchedUserId}`
          );
          const cartItemsData = cartResponse.data;
          setCartItems(Array.isArray(cartItemsData) ? cartItemsData : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false); // Set loading false after fetching is done
      }
    }
  };

  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = cartItems.reduce((acc, cartItem) => {
        const productPrice = cartItem.Product.price;
        return acc + cartItem.quantity * productPrice;
      }, 0);

      setTotal(totalAmount);
    };

    calculateTotal();
  }, [cartItems]);

  const updateQuantity = async (userId, productId, newQuantity) => {
    if (newQuantity < 1) return;

    setLoading(true); // Set loading true when updating
    try {
      await axios.put(`/api/cart/update`, {
        userId,
        productId,
        quantity: newQuantity,
      });

      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      setError("Failed to update quantity.");
    } finally {
      setLoading(false); // Set loading false after update is done
    }
  };

  const deleteCartItem = async (id) => {
    setLoading(true); // Set loading true when deleting
    try {
      await axios.delete(`/api/cart/delete/${id}`);
      fetchUserIdAndCart(); // Refresh data after deleting item
    } catch (error) {
      console.error("Error deleting cart item:", error);
      setError("Failed to delete cart item.");
    } finally {
      setLoading(false); // Set loading false after deletion
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading true when checking out

    const payload = {
      user_id: userId,
      total_price: total,
      products: cartItems.map((item) => ({
        product_id: item.Product.id,
        product_name: item.Product.name,
        image: item.Product.images[0],
        price: item.Product.price,
        quantity: item.quantity,
      })),
    };

    try {
      // Create the transaction
      const response = await axios.post("/api/transaction/create", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);

      // Clear the cart after the transaction is successful
      await axios.post(`/api/cart/clear`, {
        user_id: userId,
      });

      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("Checkout or cart clearing failed. Please try again.");
    } finally {
      setLoading(false); // Set loading false after checkout
    }
  };

  useEffect(() => {
    fetchUserIdAndCart();
  }, [user]);

  // Redirect to login if user is not authenticated
  if (!user) {
    return navigate("/login");
  }

  return (
    <div>
      <UserNavigation />
      {loading ? (
        <div className="flex max-w-7xl mx-auto space-x-3 p-3">
          {/* Loading placeholders */}
        </div>
      ) : (
        <div className="flex max-w-7xl mx-auto space-x-3 p-3">
          <div className="w-3/5 bg-white shadow-md">
            <div className="font-bold p-4">CART</div>
            {cartItems.length === 0 ? (
              <p className="p-4">Your cart is empty.</p>
            ) : (
              cartItems.map((cart) => {
                const product = cart.Product;

                return (
                  <div
                    key={cart.product_id}
                    className="flex space-x-3 p-4 border-t"
                  >
                    <div>
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={`/public/images/products/${product.images[0]}`}
                          alt={product.name}
                          className="w-20 h-20 object-cover border-2 rounded-md"
                        />
                      </Link>
                    </div>
                    <div className="flex-1 flex justify-between px-4">
                      <div>
                        <p className="text-lg font-semibold">{product.name}</p>
                        <p className="text-gray-600">
                          {Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(product.price)}
                        </p>
                      </div>

                      <div className="flex flex-col justify-end">
                        <div className="flex items-center space-x-4">
                          <button
                            disabled={loading}
                            onClick={() => deleteCartItem(cart.id)}
                            className="text-red-500 border-2 p-2 rounded-md"
                          >
                            Delete
                          </button>
                          <div className="border-2 flex rounded-md space-x-3 items-center text-center">
                            <button
                              disabled={loading}
                              onClick={() =>
                                updateQuantity(
                                  userId,
                                  product.id,
                                  cart.quantity - 1
                                )
                              }
                              className="px-2 py-1"
                            >
                              -
                            </button>
                            <p className="text-gray-500">{cart.quantity}</p>
                            <button
                              disabled={loading}
                              onClick={() =>
                                updateQuantity(
                                  userId,
                                  product.id,
                                  cart.quantity + 1
                                )
                              }
                              className="px-2 py-1"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="w-2/5">
            <div className="bg-white p-5 shadow-md sticky top-14">
              <h1 className="font-bold text-xl">Total:</h1>
              <div className="font-bold text-xl">
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(total)}
              </div>
              <div className="mt-3">
                <button
                  disabled={total === 0 || loading}
                  onClick={handleCheckout}
                  className={
                    "bg-green-500 w-full py-2 font-bold text-white text-xl rounded-md " +
                    (total === 0 || loading
                      ? "opacity-50 cursor-not-allowed"
                      : "")
                  }
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
