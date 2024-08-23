import React, { useState, useEffect } from "react";
import AdminNavigation from "../../components/navigations/admin-navigation";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState(user.id);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user && !user.id) {
      axios
        .get(`/api/user/getIdByEmail?email=${user.email}`)
        .then((response) => {
          setUserId(response.data.id);
        })
        .catch((error) => {
          console.error("Error fetching user ID:", error);
        });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/create/product", {
        name,
        price,
        category_id: categoryId,
        user_id: userId,
        description,
      });
      console.log("User created:", response.data);

      setName("");
      setPrice("");
      setCategoryId("");
      setUserId(user.id);
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <AdminNavigation />
      <form
        onSubmit={handleSubmit}
        className="p-5 bg-white w-1/3 shadow-md mx-auto"
      >
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            className="border border-gray-400 p-1 rounded-sm w-full"
          />
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="price"
            className="border border-gray-400 p-1 rounded-sm w-full"
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            type="text"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            id="category"
            className="border border-gray-400 p-1 rounded-sm w-full"
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            className="border border-gray-400 p-1 rounded-sm w-full"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded-sm"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
