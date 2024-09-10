import axios from "axios";
import { useEffect, useState } from "react";
import AdminNavigation from "../../components/navigations/admin-navigation";

const AdminUserPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/user/show");

      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (error) {
    return (
      <div className="flex">
        <div className="w-1/5">
          <AdminNavigation />
        </div>
        <div className="w-4/5">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="w-1/5">
        <AdminNavigation />
      </div>
      <div className="w-4/5">
        <div className="p-4">
          <div className="p-2 bg-white rounded-md shadow-md ">
            <table className="table ">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Email</td>
                  <td>Status</td>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPage;
