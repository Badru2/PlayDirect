import React from "react";
import { useAuth } from "../../hooks/useAuth";
import SuperAdminNavigation from "../navigations/super-admin-navigation";
import AdminNavigation from "../navigations/admin-navigation";
import UserNavigation from "../navigations/user-navigation";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../../pages/login";
import Register from "../../pages/register";
import SuperAdminDashboard from "../../pages/super-admin/dashboard";
import AdminDashboard from "../../pages/admin/dashboard";
import UserDashboard from "../../pages/user/dashboard";
import ProductDetails from "../../components/user/detail-product";
import EditAdmin from "../../components/superAdmin/edit-admin";
import ProtectedRoute from "../../ProtectedRoute";
import Cart from "../../pages/user/cart";
import OrderList from "../../pages/user/order-list";
import DetailOrder from "../../pages/user/detail-order";
import Wishlist from "../../pages/user/wishlist";
import AdminPage from "../../pages/super-admin/admin";

function CustomLayout() {
  const { user } = useAuth(); // Ensure useAuth is correctly providing user

  const renderNavigation = () => {
    switch (user?.role) {
      case "superAdmin":
        return <SuperAdminNavigation />;
      case "admin":
        return <AdminNavigation />;
      default:
        return <UserNavigation />;
    }
  };

  return (
    <Router>
      {/* {renderNavigation()} */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              allowedRoles={["admin"]}
            />
          }
        />
        <Route
          path="/superAdmin/admin"
          element={
            <ProtectedRoute
              element={<AdminPage />}
              allowedRoles={["superAdmin"]}
            />
          }
        />
        <Route
          path="/superAdmin/dashboard"
          element={
            <ProtectedRoute
              element={<SuperAdminDashboard />}
              allowedRoles={["superAdmin"]}
            />
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute
              element={<UserDashboard />}
              allowedRoles={["user"]}
            />
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin/edit/:id" element={<EditAdmin />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute element={<Cart />} allowedRoles={["user"]} />
          }
        />
        <Route
          path="/order-list"
          element={
            <ProtectedRoute element={<OrderList />} allowedRoles={["user"]} />
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute element={<DetailOrder />} allowedRoles={["user"]} />
          }
        />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </Router>
  );
}

export default CustomLayout; // No parentheses here
