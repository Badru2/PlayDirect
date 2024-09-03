import React, { useEffect, useState } from "react";
import AdminNavigation from "../../components/navigations/admin-navigation";
import CreateCategoryProduct from "../../components/admin/create-category-product";
import CreateGenreProduct from "../../components/admin/create-genre-product";
import CreateProduct from "../../components/admin/create-product";
import axios from "axios";

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransaction = async () => {
    try {
      const response = await axios.get("/api/transaction/show");

      // filter status
      const filteredTransactions = response.data.filter(
        (transaction) => transaction.status === "pending"
      );

      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(`/api/transaction/update/${id}`, {
        status,
      });

      console.log(response.data);
      fetchTransaction();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  return (
    <div>
      <AdminNavigation />
      {/* Uncomment these components if needed */}
      {/* <CreateCategoryProduct />
      <CreateGenreProduct /> */}
      <CreateProduct />
      <div className="p-4 space-y-3">
        {transactions.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex flex-col bg-white shadow-md p-4 space-y-3"
            >
              <div>
                <p>
                  User: <b>{transaction.User?.username || "N/A"}</b>
                </p>
                <p>
                  Total Price:{" "}
                  <b>
                    {Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(Number(transaction.total_price))}
                  </b>
                </p>
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
                  onClick={() => updateStatus(transaction.id, "delivered")}
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
