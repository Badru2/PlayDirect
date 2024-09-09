import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import getCategoriesProduct from "./get-category-product";
import getGenreProduct from "./get-genre-product";
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
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [userId, setUserId] = useState(user?.id || "");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`/api/admin/get/id?email=${user.email}`)
        .then((response) => setUserId(response.data.id))
        .catch((err) => {
          setError("Error fetching user ID");
          console.error("Error fetching user ID:", err);
        });
    }
  }, [user]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5 MB

    const validImages = selectedFiles.filter(
      (file) => file.type.startsWith("image/") && file.size <= maxSize
    );

    if (validImages.length !== selectedFiles.length) {
      setError("Some files are not images or are too large (max 5 MB).");
      return;
    }

    const previewUrls = validImages.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...validImages]);
    setPreviews((prevPreviews) => [...prevPreviews, ...previewUrls]);
    setError("");
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleAddMoreImages = () => {
    fileInputRef.current.click();
  };

  const handleGenreChange = (e) => {
    const genreId = e.target.value;
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genreId)
        ? prevSelectedGenres.filter((id) => id !== genreId)
        : [...prevSelectedGenres, genreId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate that required fields are filled
    if (
      !name ||
      !price ||
      !categoryId ||
      // selectedGenres.length === 0 ||
      !description ||
      !stock
    ) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    images.forEach((image) => formData.append("images", image));
    formData.append("category_id", categoryId);

    // Append genres correctly
    selectedGenres.forEach((genreId) => {
      formData.append("genre_id", genreId); // Notice the '[]' to handle multiple values
    });

    formData.append("user_id", userId);
    formData.append("description", description);
    formData.append("stock", stock);

    try {
      const response = await axios.post("/api/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Product created:", response.data);
      // Reset form fields
      setName("");
      setPrice("");
      setImages([]);
      setCategoryId("");
      setSelectedGenres("");
      setDescription("");
      setStock("");
      setPreviews([]);
    } catch (err) {
      setError(err.response?.data?.error || "Error creating product");
      console.error("Error creating product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 bg-white shadow-md m-4 grid grid-cols-2 gap-3"
    >
      <div>
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
            accept="image/*"
            id="image"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleAddMoreImages}
            className="mt-3 bg-blue-500 text-white px-4 py-1 rounded-sm"
          >
            Add More Images
          </button>
          <div className="image-previews gap-3 grid grid-cols-3">
            {previews.length > 0 ? (
              previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full object-cover mt-2 mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p>No images selected</p>
            )}
          </div>
        </div>
      </div>

      <div>
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

        <div className={categoryId == "1" ? "" : "hidden"}>
          <label htmlFor="genre">Genre:</label>
          {genres.map((g) => (
            <div key={g.id} className="flex items-center">
              <input
                type="checkbox"
                value={g.id}
                onChange={handleGenreChange}
                className="mr-2"
                name="genre"
              />
              <label>{g.name}</label>
            </div>
          ))}
        </div>

        <div>
          <label htmlFor="stock">Stock:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            className="border border-gray-400 p-1 rounded-sm w-full"
          />
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
      </div>
    </form>
  );
};

export default CreateProduct;
