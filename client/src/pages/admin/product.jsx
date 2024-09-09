import CreateProduct from "../../components/admin/create-product";
import AdminNavigation from "../../components/navigations/admin-navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateProductPages = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get("/api/product/show");

      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Error fetching product");
    }
  };

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
                  {/* <td>Category</td> */}
                  {/* <td>Stock</td> */}
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>
                      {Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(product.price)}
                    </td>
                    {/* <td>{product.Category.name}</td> */}
                    <td>Edit-Delete-Show</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPages;
