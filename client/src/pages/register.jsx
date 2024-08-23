import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        // Redirect after successful registration
        window.location.href = "/";
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-5 w-1/4 shadow-md mx-auto">
      <h2 className="text-2xl text-center font-bold">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="font-bold">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-white w-full border"
          />
        </div>
        <div>
          <label className="font-bold">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white w-full border"
          />
        </div>
        <div>
          <label className="font-bold">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white w-full border"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 w-full"
        >
          Register
        </button>
      </form>

      <div className="text-center">
        Already have an account? <br />
        <span className="text-blue-500 font-bold">
          <Link to="/login">Sign In.</Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
