import axios from "axios";
import React, { useEffect, useState } from "react";
import UserNavigation from "../../components/navigations/user-navigation";
import { useAuth } from "../../hooks/useAuth";

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false); // Track if we're in edit mode
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    avatar: null,
  });

  // Fetch user profile data
  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/profile/show?email=${user.email}`);
      console.log(response.data);
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
        avatar: null,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input for avatar
  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  // Handle profile update form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile || !profile.id) {
      console.error("Profile ID is missing.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    try {
      const response = await axios.put(
        `/api/profile/update/${profile.id}`,
        formDataToSend
      );
      console.log("Profile updated:", response.data);
      setProfile(response.data);
      setEditMode(false); // Exit edit mode after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <UserNavigation />
      <div className="mx-auto max-w-7xl mt-4">
        <h1>User Profile</h1>
        {profile ? (
          <div>
            <img
              src={
                profile.avatar
                  ? `/public/images/avatar/${profile.avatar}`
                  : `https://ui-avatars.com/api/?name=${profile.username}`
              }
              alt={profile.username}
              className="w-20 h-20 rounded-full object-cover"
            />

            {editMode ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <div>
                  <label>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="border rounded p-2"
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border rounded p-2"
                  />
                </div>
                <div>
                  <label>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border rounded p-2"
                  />
                </div>
                <div>
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="border rounded p-2"
                  />
                </div>
                <div>
                  <label>Avatar:</label>
                  <input
                    type="file"
                    name="avatar"
                    onChange={handleFileChange}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white p-2 rounded ml-2"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <p>Name: {profile.username}</p>
                <p>Email: {profile.email}</p>
                <p>Phone: {profile.phone}</p>
                <p>Address: {profile.address}</p>
                <button
                  className="bg-green-500 text-white p-2 rounded mt-4"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
