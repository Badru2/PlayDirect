import React, { useState } from "react";
import axios from "axios";

const CreateGenreProduct = () => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/create/product-genre",
        {
          name,
        }
      );

      console.log(201, response);

      setName("");
    } catch (error) {
      console.error(500, error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5">
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateGenreProduct;
