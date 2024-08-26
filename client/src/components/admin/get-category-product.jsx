import { useState, useEffect } from "react";
import axios from "axios";

const getCategoriesProduct = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/product-categories/show");
        setCategories(response.data);
      } catch (error) {
        setError("Error fetching categories");
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  return { categories, error };
};

export default getCategoriesProduct;
