import { useState, useEffect } from "react";
import axios from "axios";

const getGenreProduct = () => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("/api/product-genres/show");
        setGenres(response.data);
      } catch (error) {
        setError("Error fetching genres");
        console.error(error);
      }
    };

    fetchGenres();
  }, []); // Empty dependency array means this runs once after the initial render

  return { genres, error };
};

export default getGenreProduct;
