import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditAdmin = () => {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/api/admin/edit/${id}`, {
        username,
        email,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(id);
  }, [id]);

  return (
    <form onSubmit={handleEdit} className="space-y-3">
      <div>
        <label htmlFor="username" className="font-bold">
          Name
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="bg-white w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label htmlFor="email" className="font-bold">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-white w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label htmlFor="password" className="font-bold">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-white w-full border rounded px-2 py-1"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 mt-2 rounded w-full"
      >
        Update
      </button>
    </form>
  );
};

export default EditAdmin;
