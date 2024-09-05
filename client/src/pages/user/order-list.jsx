import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavigation from "../../components/navigations/user-navigation";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

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

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(`/api/transaction/update/${id}`, {
        status,
      });

      console.log(response.data);
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
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
              <Link to={`/order/${order.id}`}>
                <h2 className="text-xl font-bold mb-2">Order ID: {order.id}</h2>
              </Link>

              <div className="mb-2">
                <div>
                  Date: {new Date(order.updated_at).toLocaleDateString()}
                </div>
                <div>
                  Time: {new Date(order.updated_at).toLocaleTimeString()}
                </div>
              </div>
              <div>
                Status:{" "}
                <span
                  className={
                    "mb-2 font-semibold uppercase " +
                    `${
                      order.status === "cancelled"
                        ? "text-red-500 "
                        : "text-black "
                    }` +
                    `${
                      order.status === "delivered"
                        ? "text-green-500 "
                        : "text-black "
                    }` +
                    `${
                      order.status === "pending"
                        ? "text-yellow-500 "
                        : "text-black "
                    }` +
                    `${
                      order.status === "deliver"
                        ? "text-blue-500 "
                        : "text-black "
                    }`
                  }
                >
                  {order.status}
                </span>
              </div>
              <div className="mb-2">
                Total:{" "}
                <b>
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(order.total_price)}
                </b>
              </div>
              <div className="space-x-3 flex">
                <Link to={`/order/${order.id}`}>
                  <button className="bg-blue-500 text-white px-4 py-1 rounded-sm">
                    Detail
                  </button>
                </Link>
                <div>
                  {order.status === "deliver" ||
                  order.status === "delivered" ? (
                    <button
                      disabled={order.status === "delivered"}
                      onClick={() => updateStatus(order.id, "delivered")}
                      className={
                        "bg-green-500 text-white px-4 py-1 rounded-sm " +
                        `${
                          order.status === "delivered"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`
                      }
                    >
                      Finish
                    </button>
                  ) : (
                    <button
                      disabled={
                        order.status === "cancelled" ||
                        order.status === "delivered"
                      }
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className={
                        "bg-red-500 text-white px-4 py-1 rounded-sm " +
                        `${
                          order.status === "cancelled" ||
                          order.status === "delivered"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`
                      }
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;
