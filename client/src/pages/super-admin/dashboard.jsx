import React, { useEffect, useState } from "react";
import SuperAdminNavigation from "../../components/navigations/super-admin-navigation";
import axios from "axios";
import CreateAdmin from "../../components/superAdmin/create-admin";
import GetAdmins from "../../components/superAdmin/get-admins";

const SuperAdminDashboard = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/admin/create", {
        username,
        email,
        password,
      });
      console.log("Admin created:", response.data);

      setUsername("");
      setEmail("");
      setPassword("");
      getAdmins();
      setIsModalOpen(false); // Close the modal after successful admin creation
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAdmin = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/delete/${id}`);
      console.log("Admin deleted:", response.data);
      getAdmins();
    } catch (error) {
      console.error(error);
    }
  };

  const getAdmins = async () => {
    try {
      const response = await axios.get(`/api/admin/show`);
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

      <GetAdmins admins={admins} deleteAdmin={deleteAdmin} />
    </div>
  );
};

export default SuperAdminDashboard;
