import CreateProduct from "../../components/admin/create-product";
import AdminNavigation from "../../components/navigations/admin-navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const ProductPages = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category_id, setCategoryId] = useState(0);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(0);

  const [editMode, setEditMode] = useState(null); // Track the product being edited
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

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
        name: name,
        price: price,
        category_id: category_id,
        description: description,
        stock: stock,
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
    setName(product.name);
    setPrice(product.price);
    setCategoryId(product.category_id);
    setDescription(product.description);
    setStock(product.stock);
    setEditMode(product.id);
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
                        {Intl.NumberFormat("id-ID", {
                          currency: "IDR",
                        }).format(product.price)}
                      </td>
                      <td>{product.stock}</td>
                      <td className="space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-yellow-300 p-2 rounded-md shadow-sm text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <g
                              fill="none"
                              stroke="currentColor"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                            >
                              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                            </g>
                          </svg>
                        </button>

                        <button className="bg-blue-500 p-2 rounded-md shadow-sm text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill="currentColor"
                              d="m8.93 6.588l-2.29.287l-.082.38l.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319c.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246c-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
                            />
                          </svg>
                        </button>

                        <button className="bg-red-500 p-2 rounded-md shadow-sm text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M16 9v10H8V9zm-1.5-6h-5l-1 1H5v2h14V4h-3.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2z"
                            />
                          </svg>
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
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                />
                              </div>

                              <div className="flex flex-col ">
                                <label htmlFor="price">Price:</label>
                                <input
                                  type="number"
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="w-1/2">
                              <div>
                                <div className="flex flex-col">
                                  <label htmlFor="stock">Stock:</label>
                                  <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => handleUpdateProduct(product.id)}
                              >
                                Save
                              </button>
                              <button onClick={() => setEditMode(null)}>
                                Cancel
                              </button>
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
