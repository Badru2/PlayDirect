import GetAdmins from "../../components/superAdmin/get-admins";
import axios from "axios";
import React, { useState, useEffect } from "react";
import CreateAdmin from "../../components/superAdmin/create-admin";
import SuperAdminNavigation from "../../components/navigations/super-admin-navigation";

const AdminPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null); // Error state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/admin/create", {
        username,
        email,
        password,
      });
      console.log("Admin created:", response.data);

      // Reset form fields
      setUsername("");
      setEmail("");
      setPassword("");
      getAdmins();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating admin:", error);
      setError("Failed to create admin. Please try again."); // Handle error
    }
  };

  const deleteAdmin = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/delete/${id}`);
      console.log("Admin deleted:", response.data);
      getAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      setError("Failed to delete admin. Please try again."); // Handle error
    }
  };

  const getAdmins = async () => {
    try {
      const response = await axios.get(`/api/admin/show`);
      let admins = response.data;

      // Sort admins by name in ascending order
      admins.sort((a, b) => a.username.localeCompare(b.username));

      setAdmins(admins);
      setError(null); // Clear error after success
    } catch (error) {
      setError("Error fetching admins");
      console.log(error);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <div className="flex">
      <div className="w-1/5">
        <SuperAdminNavigation />
      </div>
      <div className="w-4/5 p-5">
        {isModalOpen && (
          <dialog open className="modal">
            <div className="modal-box w-11/12 max-w-5xl bg-white">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>
              </form>
              <CreateAdmin
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
              />
            </div>
          </dialog>
        )}
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Add Admin
        </button>
        {error && <p className="text-red-500">{error}</p>} {/* Display error */}
        <div>
          <GetAdmins admins={admins} deleteAdmin={deleteAdmin} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
