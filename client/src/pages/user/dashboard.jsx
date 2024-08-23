import React, { useEffect } from "react";
import UserNavigation from "../../components/navigations/user-navigation";
import { useAuth } from "../../hooks/useAuth";

const UserDashboard = () => {
  const { user } = useAuth();
  useEffect(() => {
    console.log(user);
  });
  return (
    <div>
      <UserNavigation />
      User Dashboard
    </div>
  );
};

export default UserDashboard;
