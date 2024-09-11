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
        .then((response) => {
          setUserId(response.data.id);
          console.log(response.data.id);
        })
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

  // Function to format the price with commas
  const formatPrice = (value) => {
    // Remove all non-digit characters (except for decimal point)
    let cleanValue = value.replace(/[^0-9.]/g, "");

    // Split the integer and decimal parts if a decimal point exists
    const parts = cleanValue.split(".");
    const integerPart = parts[0];
    const decimalPart = parts[1] ? `.${parts[1]}` : "";

    // Format the integer part with commas
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return formattedInteger + decimalPart;
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(formatPrice(value)); // Format and set the price value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate that required fields are filled
    if (!name || !price || !categoryId || !description || !stock) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.replace(/,/g, "")); // Remove commas for backend
    images.forEach((image) => formData.append("images", image));
    formData.append("category_id", categoryId);

    // Append genres correctly
    selectedGenres.forEach((genreId) => {
      formData.append("genre_id", genreId);
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
      setSelectedGenres([]);
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
            type="text"
            value={price}
            onChange={handlePriceChange} // Update price with commas as user types
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

        <div className={categoryId === "1" ? "" : "hidden"}>
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
            id="stock"
            className="border border-gray-400 p-1 rounded-sm w-full"
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            id="description"
            className="border border-gray-400 p-1 rounded-sm w-full h-32"
          ></textarea>
        </div>
      </div>

      {error && <p className="text-red-500 col-span-2">{error}</p>}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-sm col-span-2"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
};

export default CreateProduct;
