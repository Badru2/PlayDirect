import React, { useEffect, useState } from "react";
import AdminNavigation from "../../components/navigations/admin-navigation";
import CreateProduct from "../../components/admin/create-product";
import axios from "axios";
import { format } from "date-fns";
import { io } from "socket.io-client";

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socket = io(`:${import.meta.env.REACT_APP_SOCKET_PORT}`); // Connect to the WebSocket server

  // Fetch transactions
  const fetchTransaction = async () => {
    // setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/transaction/show");

      const filteredTransactions = response.data.filter(
        (transaction) => transaction.status === "pending"
      );

      filteredTransactions.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  // Update transaction status
  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(`/api/transaction/update/${id}`, {
        status,
      });

      console.log(response.data);

      // No need to fetchTransaction here because WebSocket will handle the update
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Error updating transaction status.");
    }
  };

  useEffect(() => {
    fetchTransaction();

    // Listen for transaction updates from the server via WebSocket
    socket.on("transactionUpdated", (data) => {
      console.log("Transaction updated:", data);

      // Refetch transactions when any update is received
      fetchTransaction();
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off("transactionUpdated");
    };
  }, []);

  return (
    <div>
      <AdminNavigation />
      <CreateProduct />

      <div className="p-4 space-y-3">
        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col bg-white shadow-md p-4 space-y-3"
            >
              <div>
                <div className="flex justify-between">
                  <div>
                    User: <b>{transaction.User?.username || "N/A"}</b>
                  </div>
                  <div>
                    Date:{" "}
                    <b>
                      {transaction.created_at
                        ? format(
                            new Date(transaction.created_at),
                            "EEE-MMM-yyyy"
                          )
                        : "N/A"}
                    </b>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    Total Price:{" "}
                    <b>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(Number(transaction.total_price))}
                    </b>
                  </div>
                  <div className="flex items-center">
                    Time:{" "}
                    <b>
                      {transaction.created_at
                        ? format(new Date(transaction.created_at), "HH:mm:ss")
                        : "N/A"}
                    </b>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 border-t-2 pt-2">
                {Array.isArray(transaction.products) &&
                transaction.products.length > 0 ? (
                  transaction.products.map((product, index) => (
                    <div key={index} className="space-y-1">
                      <div>
                        <img
                          src={"/images/products/" + product.image}
                          alt=""
                          className="max-w-52 "
                        />
                      </div>
                      <p>
                        Name: <b>{product.product_name}</b>
                      </p>
                      <p>
                        Price:{" "}
                        <b>
                          {Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(Number(product.price))}
                        </b>
                      </p>
                      <p>
                        Quantity: <b>{product.quantity}</b>
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No products available.</p>
                )}
              </div>

              <div className="flex space-x-2 justify-end">
                <button
                  onClick={() => updateStatus(transaction.id, "deliver")}
                  className="bg-blue-500 text-white px-4 py-1 rounded-sm"
                >
                  Deliver
                </button>
                <button
                  onClick={() => updateStatus(transaction.id, "cancelled")}
                  className="bg-red-500 text-white px-4 py-1 rounded-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
