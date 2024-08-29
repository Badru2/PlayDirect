import React, { useEffect, useState } from "react";
import SuperAdminNavigation from "../../components/navigations/super-admin-navigation";
import axios from "axios";
import CreateAdmin from "../../components/superAdmin/create-admin";
import GetAdmins from "../../components/superAdmin/get-admins";

const SuperAdminDashboard = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(""); // Add error state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/admin/create", {
        username,
        email,
        password,
      });
      console.log("Admin created:", response.data);

      setUsername("");
      setEmail("");
      setPassword("");
      getAdmins();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating admin:", error);
    }
  };

  const deleteAdmin = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/delete/${id}`);
      console.log("Admin deleted:", response.data);
      getAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const getAdmins = async () => {
    try {
      const response = await axios.get(`/api/admin/show`);
      let admins = response.data;

      // Sort admins by name in ascending order
      admins.sort((a, b) => a.username.localeCompare(b.username));

      setAdmins(admins);
    } catch (error) {
      setError("Error fetching admins");
      console.log(error);
    }
  };

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
    getAdmins();
    getProducts();
  }, []);

  return (
    <div>
      <SuperAdminNavigation />

      {isModalOpen && (
        <dialog open className="modal">
          <div className="modal-box w-11/12 max-w-5xl bg-white">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </form>
            <CreateAdmin
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleSubmit={handleSubmit}
            />
          </div>
        </dialog>
      )}

      <button className="btn" onClick={() => setIsModalOpen(true)}>
        Add Admin
      </button>

      <GetAdmins admins={admins} deleteAdmin={deleteAdmin} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="w-3/4 mx-auto mt-3 shadow-lg">
          <table className="table table-xs ">
            <thead className="sticky top-0 bg-white h-12">
              <tr>
                <td>Name</td>
                <td>Image</td>
                <td>Price</td>
                <td>Admin</td>
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
                          src={`/images/products/${image}`}
                          alt={product.name}
                          className="w-12 object-cover h-12"
                        />
                      ))}
                    </td>
                    <td>{formattedPrice}</td>
                    <td>{usernames[product.user_id] || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
