import React, { useEffect, useState } from "react";
import SuperAdminNavigation from "../../components/navigations/super-admin-navigation";
import axios from "axios";

import { format } from "date-fns";

const SuperAdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(""); // Add error state

  const getProducts = async () => {
    try {
      const response = await axios.get("/api/product/show");
      let products = response.data;

      // Sort products by name in ascending order
      products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setProducts(products);

      await fetchUsernames(products);
    } catch (error) {
      setError("Error fetching products");
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false once products are fetched
    }
  };

  const fetchUsernames = async (products) => {
    const userIds = Array.from(new Set(products.map((p) => p.user_id))).filter(
      Boolean
    );
    const fetchedUsernames = {};

    try {
      const usernamePromises = userIds.map((userId) =>
        axios.get(`/api/admin/getUsername/${userId}`).then((response) => ({
          userId,
          username: response.data.username,
        }))
      );

      const results = await Promise.all(usernamePromises);
      results.forEach(({ userId, username }) => {
        fetchedUsernames[userId] = username;
      });

      setUsernames(fetchedUsernames);
    } catch (error) {
      setError("Error fetching usernames");
      console.error("Error fetching usernames:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex">
      <div className="w-1/5">
        <SuperAdminNavigation />
      </div>

      <div className="w-4/5 p-5">
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="w-full mx-auto mt-3 shadow-lg">
              <table className="table table-md">
                <thead className="sticky top-0 bg-white h-12">
                  <tr>
                    <td>Name</td>
                    <td>Image</td>
                    <td>Price</td>
                    <td>Admin</td>
                    <td>History</td>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const formattedPrice = new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(product.price);

                    return (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td className="flex">
                          {product.images.map((image, index) => (
                            <img
                              key={index}
                              src={`/public/images/products/${image}`}
                              alt={product.name}
                              className="w-12 object-cover h-12"
                            />
                          ))}
                        </td>
                        <td>{formattedPrice}</td>
                        <td>{usernames[product.user_id] || "N/A"}</td>
                        <td>
                          {format(new Date(product.updated_at), "dd MMM yyyy")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
