import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserNavigation from "../../components/navigations/user-navigation";

const DetailOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null); // Initial state as null for object

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get("/api/order/" + id);
        console.log("API Response:", response.data); // Log API response

        setOrder(response.data); // Assuming response.data is the order object
      } catch (error) {
        console.error(
          "Error fetching order:",
          error.response?.data || error.message
        );
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div>
      <UserNavigation />
      <div>
        {order ? (
          <div key={order.id} className=" p-6 mb-4">
            <h2 className="text-xl font-bold mb-2">Order ID: {order.id}</h2>
            <div className="mb-2">
              <div>
                Status:{" "}
                <b
                  className={
                    "uppercase " +
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
                </b>
              </div>
              <div>
                Total:{" "}
                <b>
                  {Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(order.total_price)}
                </b>
              </div>
              <div className="flex space-x-3">
                {order.products && order.products.length > 0 ? (
                  order.products.map((product) => (
                    <div
                      key={product.id}
                      className="shadow-md rounded-md p-2 w-72"
                    >
                      <img
                        src={"/images/products/" + product.image}
                        alt={product.product_name}
                        className="w-full  object-cover"
                      />
                      <b>{product.product_name}</b>
                      <p>
                        Price:{" "}
                        <b>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(product.price)}
                        </b>
                      </p>
                      <p>
                        Quantity: <b>{product.quantity}</b>
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No products found in this order.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading order details...</p>
        )}
      </div>
    </div>
  );
};

export default DetailOrder;
