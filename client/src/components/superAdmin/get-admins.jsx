import React from "react";
import { Link } from "react-router-dom";

const GetAdmins = ({ admins, deleteAdmin }) => {
  return (
    <div className="bg-white w-1/3 mx-auto p-4 shadow-lg rounded">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">Name</th>
            <th className="border-b p-2">Email</th>
            <th className="border-b p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td className="border-b p-2">{admin.username}</td>
              <td className="border-b p-2">{admin.email}</td>
              <td className="border-b p-2">
                <button
                  onClick={() => deleteAdmin(admin.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                >
                  Delete
                </button>
                <Link to={`/admin/edit/${admin.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetAdmins;
