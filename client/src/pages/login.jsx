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
          email: email,
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
    <div className="md:flex min-h-screen">
      <div className="bg-blue-500 w-3/5"></div>

      <div className="w-full md:w-2/5 flex flex-col items-center justify-center min-h-screen">
        <div className="p-5 w-3/4 mx-auto space-y-9">
          <h2 className="text-3xl text-center font-bold font-serif">
            Login To Continue
          </h2>
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-3 ">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-100 w-full border py-3 border-gray-400 rounded-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-100 w-full border py-3 border-gray-400 rounded-sm"
                  placeholder="Password"
                />
              </div>

              <div className="flex justify-end">
                <Link className="text-blue-400 ">Forgot Password?</Link>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 text-lg font-bold rounded-sm w-full"
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
      </div>
    </div>
  );
};

export default Login;
