import React, { useEffect, useState } from "react";
import SuperAdminNavigation from "../../components/navigations/super-admin-navigation";
import axios from "axios";

const SuperAdminDashboard = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // read admin
  const [admins, setAdmins] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/create/admin",
        {
          username,
          email,
          password,
        }
      );
      console.log("Admin created:", response.data);

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
    }
  };

  const getAdmins = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/show/admin`);
      setAdmins(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <div>
      <SuperAdminNavigation />
      <form
        onSubmit={handleSubmit}
        className="space-y-3 w-1/4 mx-auto bg-white p-4"
      >
        <div>
          <label htmlFor="username">Name</label>
          <input
            type="text"
            typeof="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-white w-full border"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            typeof="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white w-full border"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            typeof="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white w-full border"
          />
        </div>

        <button type="submit">Create</button>
      </form>

      <div className="bg-white w-1/3 mx-auto p-4">
        <table className="w-full">
          <thead>
            <tr>
              <td>Name</td>
              <td>Email</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.username}</td>
                <td>{admin.email}</td>
                <td>Delete-Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
