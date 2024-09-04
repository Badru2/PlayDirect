import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavigation from "../../components/navigations/user-navigation";
import { useAuth } from "../../hooks/useAuth";

const OrderList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState("");

  const fetchOrders = async () => {
    try {
      const userResponse = await axios.get(
        `/api/admin/get/id?email=${user.email}`
      );
      const fetchedUserId = userResponse.data.id;
      setUserId(fetchedUserId);

      if (fetchedUserId) {
        const response = await axios.get("/api/transaction/show");

        const filterAndSortOrders = (fetchedUserId) => {
          const filtered = response.data.filter(
            (order) => order.user_id === fetchedUserId
          );
          const sorted = filtered.sort(
            (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
          );
          setOrders(sorted);
        };

        filterAndSortOrders(fetchedUserId);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div>
      <UserNavigation />
      <div>
        <h1 className="text-3xl font-bold mb-4">Order List</h1>
        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg p-6 mb-4"
            >
              <h2 className="text-xl font-bold mb-2">Order ID: {order.id}</h2>
              <div className="mb-2">
                <div>
                  Date: {new Date(order.updated_at).toLocaleDateString()}
                </div>
                <div>
                  Time: {new Date(order.updated_at).toLocaleTimeString()}
                </div>
              </div>
              <p
                className={
                  "mb-2 " +
                  `${order.status === "cancelled" && "text-red-500 "}` +
                  `${order.status === "delivered" && "text-green-500 "}` +
                  `${order.status === "pending" && "text-yellow-500 "}`
                }
              >
                Status: {order.status}
              </p>
              <p className="mb-2">
                Total:{" "}
                {Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(order.total_price)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;
