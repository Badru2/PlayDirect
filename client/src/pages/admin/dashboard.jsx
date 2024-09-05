import React, { useEffect, useState } from "react";
import AdminNavigation from "../../components/navigations/admin-navigation";
import CreateCategoryProduct from "../../components/admin/create-category-product";
import CreateGenreProduct from "../../components/admin/create-genre-product";
import CreateProduct from "../../components/admin/create-product";
import axios from "axios";
import { format } from "date-fns";
// import { id } from "date-fns/locale";

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransaction = async () => {
    try {
      const response = await axios.get("/api/transaction/show");

      // filter status
      const filteredTransactions = response.data.filter(
        (transaction) => transaction.status === "pending"
      );

      filteredTransactions.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
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
                <div className="flex justify-between">
                  <div>
                    User: <b>{transaction.User?.username || "N/A"}</b>
                  </div>
                  {/* Get date and time */}
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
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <g fill="none">
                        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                        <path
                          fill="currentColor"
                          d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"
                        ></path>
                      </g>
                    </svg>{" "} */}
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
