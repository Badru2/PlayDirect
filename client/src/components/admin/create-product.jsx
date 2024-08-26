import React, { useState, useEffect } from "react";
import axios from "axios";
import getCategoriesProduct from "./get-category-product";
import getGenreProduct from "./get-genre-preduct";
import { useAuth } from "../../hooks/useAuth";

const CreateProduct = () => {
  const { genres } = getGenreProduct();
  const { categories } = getCategoriesProduct();

  const { user } = useAuth();
  const [previews, setPreviews] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [genreId, setGenreId] = useState("");
  const [userId, setUserId] = useState(user?.id || "");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && user.email) {
      axios
        .get(`/api/admin/get/admin/id?email=${user.email}`)
        .then((response) => {
          setUserId(response.data.id);
        })
        .catch((error) => {
          setError("Error fetching user ID");
          console.error("Error fetching user ID:", error);
        });
    }
  }, [user]);

  useEffect(() => {
    // Cleanup image previews
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleImageChange = (e) => {
    const selectedFiles = [...e.target.files];
    setImages(selectedFiles);
    console.log(selectedFiles);

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });
    formData.append("category_id", categoryId);
    formData.append("genre_id", genreId);
    formData.append("user_id", userId);
    formData.append("description", description);

    try {
      const response = await axios.post("/api/product/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product created:", response.data);
      // Reset form
      setName("");
      setPrice("");
      setImages([]);
      setCategoryId("");
      setGenreId("");
      setDescription("");
      setPreviews([]);
    } catch (error) {
      setError(error.response?.data?.error || "Error creating product");
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          required
          id="name"
          className="border border-gray-400 p-1 rounded-sm w-full"
        />
      </div>

      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          id="price"
          className="border border-gray-400 p-1 rounded-sm w-full"
        />
      </div>

      <div>
        <label htmlFor="image">Images:</label>
        <input
          type="file"
          id="image"
          multiple
          // value={[images]}
          onChange={handleImageChange}
          className="block mb-2"
        />
        <div className="image-previews">
          {previews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-32 h-32 object-cover mt-2 mr-2"
            />
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          className="w-full py-2"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="genre">Genre:</label>
        <select
          id="genre"
          className="w-full py-2"
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
        >
          <option value="">Select Genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          className="border border-gray-400 p-1 rounded-sm w-full"
        ></textarea>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-1 rounded-sm"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
};

export default CreateProduct;
