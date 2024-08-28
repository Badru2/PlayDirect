import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Use navigate for redirection
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registrationResponse = await axios.post(
        "/api/register",
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );

      if (registrationResponse.status === 201) {
        try {
          const loginResponse = await axios.post("/api/login", {
            email,
            password,
          });

          const data = loginResponse.data;

          if (loginResponse.status === 200) {
            setMessage("Login successful!");

            // Mock login logic, including username
            await login({
              email: email,
              role: data.role,
              token: data.token,
            });

            localStorage.setItem("token", data.token);
            navigate("/"); // Redirect to the dashboard
          } else {
            setMessage(data.error || "Login failed");
          }
        } catch (error) {
          setMessage("An error occurred during login. Please try again later.");
          console.error("Login Error:", error);
        }
      } else {
        setMessage(registrationResponse.data.error || "Registration failed");
      }
    } catch (error) {
      setMessage(
        "An error occurred during registration. Please try again later."
      );
      console.error("Registration Error:", error);
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
        {message && <p>{message}</p>}
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
