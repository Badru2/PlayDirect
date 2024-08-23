import React, { useState, useEffect } from "react";
import AdminNavigation from "../../components/navigations/admin-navigation";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import CreateCategoryProduct from "./create-category-product";
import CreateGenreProduct from "./create-genre-product";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState([]);
  const [genre, setGenre] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [genreId, setGenreId] = useState("");
  const [userId, setUserId] = useState(user.id);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user.email) {
      axios
        .get(`/api/user/getIdByEmail?email=${user.email}`)
        .then((response) => {
          setUserId(response.data.id);
        })
        .catch((error) => {
          setError("Error fetching user ID");
          console.error("Error fetching user ID:", error);
        });
    }
    getCategory();
    getGenre();
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    if (image) formData.append("image", image);
    formData.append("category_id", categoryId);
    formData.append("genre_id", genreId);
    formData.append("user_id", userId);
    formData.append("description", description);

    try {
      const response = await axios.post("/api/create/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product created:", response.data);
      // Reset form
      setName("");
      setPrice("");
      setImage("");
      setCategoryId("");
      setGenreId("");
      setDescription("");
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server Error: ${error.response.data.error}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response received from server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async () => {
    try {
      const response = await axios.get("/api/get/product-category");
      setCategory(response.data);
    } catch (error) {
      setError("Error fetching categories");
      console.error(error);
    }
  };

  const getGenre = async () => {
    try {
      const response = await axios.get("/api/get/product-genre");
      setGenre(response.data);
    } catch (error) {
      setError("Error fetching genres");
      console.error(error);
    }
  };

  return (
    <div>
      <AdminNavigation />
      <CreateCategoryProduct />
      <CreateGenreProduct />
      {error && <p className="text-red-500">{error}</p>}
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
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <select
          name="category"
          id="category"
          className="w-full py-2"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {category.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="genre"
          id="genre"
          className="w-full py-2"
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
        >
          <option value="">Select Genre</option>
          {genre.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

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
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
