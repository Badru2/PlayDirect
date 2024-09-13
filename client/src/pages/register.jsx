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
    <div className="md:flex min-h-screen">
      <div className="bg-blue-500 w-3/5"></div>

      <div className="w-full md:w-2/5 flex flex-col items-center justify-center min-h-screen">
        <div className="p-5 w-3/4 mx-auto space-y-6">
          <h2 className="text-3xl text-center font-bold font-serif ">
            Register To Continue
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-gray-100 w-full border rounded-sm py-3"
                  placeholder="Username"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-100 w-full border rounded-sm py-3"
                  placeholder="Email"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-100 w-full border rounded-sm py-3"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 w-full rounded-sm font-bold"
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
      </div>
    </div>
  );
};

export default Register;
