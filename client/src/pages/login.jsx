import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");

        localStorage.setItem("token", data.token);

        if (data.role === "superAdmin") {
          navigate("/superAdmin/dashboard");
        } else if (data.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data.role === "user") {
          navigate("/dashboard");
        }
      } else {
        setMessage(data.error);
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
