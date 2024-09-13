import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import CreateProduct from "../../components/admin/create-product";
import AdminNavigation from "../../components/navigations/admin-navigation";
import getCategoriesProduct from "../../components/admin/get-category-product";

const ProductPages = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const { categories } = getCategoriesProduct();

  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null); // State for the product being edited
  const [editMode, setEditMode] = useState(null); // Track the product being edited
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await axios.get("/api/product/show");
      const sortedProducts = response.data.sort((a, b) => a.stock - b.stock);
      setProducts(sortedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Error fetching product");
    }
  };

  // Update product
  const handleUpdateProduct = async (productId) => {
    try {
      const response = await axios.put(`/api/product/update/${productId}`, {
        user_id: userId,
        ...currentProduct, // Spread current product state
      });
      console.log("Product updated:", response.data);
      setEditMode(null); // Exit edit mode
      fetchProduct(); // Refresh product list
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Set values in state when editing a product
  const handleEdit = (product) => {
    setCurrentProduct({ ...product }); // Set the product to be edited
    setEditMode(product.id); // Set the product ID being edited
  };

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`/api/admin/get/id?email=${user.email}`)
        .then((response) => {
          setUserId(response.data.id);
          console.log("User ID fetched successfully.", response.data.id);
        })
        .catch((err) => {
          setError("Error fetching user ID");
          console.error("Error fetching user ID:", err);
        });
    }
  }, [user]);

  useEffect(() => {
    fetchProduct();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen">
        <AdminNavigation />
        <div className="w-4/5">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-1/5">
        <AdminNavigation />
      </div>
      <div className="w-4/5">
        <CreateProduct />
        <div className="p-4">
          <div className="bg-white shadow-md p-2">
            <table className="table">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Price</td>
                  <td>Stock</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <React.Fragment key={product.id}>
                    <tr>
                      <td>{product.name}</td>
                      <td>
                        Rp.{" "}
                        <b>
                          {Intl.NumberFormat("id-ID", {
                            currency: "IDR",
                          }).format(product.price)}
                        </b>
                      </td>
                      <td>
                        <b>{product.stock}</b>
                      </td>
                      <td className="space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-yellow-300 p-2 rounded-md shadow-sm text-white"
                        >
                          Edit
                        </button>

                        <button className="bg-blue-500 p-2 rounded-md shadow-sm text-white">
                          Info
                        </button>

                        <button className="bg-red-500 p-2 rounded-md shadow-sm text-white">
                          Delete
                        </button>
                      </td>
                    </tr>

                    {editMode === product.id && (
                      <tr className="bg-gray-300">
                        <td colSpan={4}>
                          <div className="flex space-x-3">
                            <div className="flex flex-col w-1/2">
                              <div className="flex flex-col">
                                <label htmlFor="name">Name:</label>
                                <input
                                  type="text"
                                  value={currentProduct?.name || ""}
                                  onChange={(e) =>
                                    setCurrentProduct({
                                      ...currentProduct,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor="price">Price:</label>
                                <input
                                  type="number"
                                  value={currentProduct?.price || 0}
                                  onChange={(e) =>
                                    setCurrentProduct({
                                      ...currentProduct,
                                      price: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>

                            <div className="w-1/2 flex flex-col justify-between">
                              <div className="flex space-x-3">
                                <div className="w-1/2 flex flex-col">
                                  <label htmlFor="category">Category</label>
                                  <select
                                    value={currentProduct?.category_id || 0}
                                    onChange={(e) =>
                                      setCurrentProduct({
                                        ...currentProduct,
                                        category_id: Number(e.target.value),
                                      })
                                    }
                                    className="w-full py-[10px] px-2"
                                  >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                      <option
                                        key={category.id}
                                        value={category.id}
                                      >
                                        {category.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="w-1/2 flex flex-col">
                                  <label htmlFor="stock">Stock:</label>
                                  <input
                                    type="number"
                                    value={currentProduct?.stock || 0}
                                    onChange={(e) =>
                                      setCurrentProduct({
                                        ...currentProduct,
                                        stock: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              <div className="flex space-x-3">
                                <button
                                  onClick={() =>
                                    handleUpdateProduct(currentProduct.id)
                                  }
                                  className="bg-blue-500 text-white px-4 py-1 rounded-sm "
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditMode(null)}
                                  className="bg-red-500 text-white px-4 py-1 rounded-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPages;
