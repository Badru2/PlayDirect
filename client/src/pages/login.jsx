import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios
import { useAuth } from "../hooks/useAuth"; // Adjust the path based on your project structure

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth(); // Destructure the login function from useAuth

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      const data = response.data;

      if (response.status === 200) {
        setMessage("Login successful!");

        // Mock login logic, including username
        await login({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          token: data.token,
        });

        localStorage.setItem("token", data.token);
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-white p-5 w-1/4 shadow-md mx-auto">
      <h2 className="text-2xl text-center font-bold">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
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
          className="bg-blue-500 text-white px-4 py-1 font-bold rounded-sm w-full"
        >
          Login
        </button>
        {message && <p>{message}</p>}
      </form>

      <div className="text-center">
        Didn't have an account? <br />
        <span className="text-blue-500 font-bold">
          <Link to="/register">Sign Up.</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
