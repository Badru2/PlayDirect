import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/admin/dashboard";
import SuperAdminDashboard from "./pages/super-admin/dashboard";
import UserDashboard from "./pages/user/dashboard";
import Register from "./pages/register";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./ProtectedRoute";
import ProductDetails from "./components/user/detail-product";
import EditAdmin from "./components/superAdmin/edit-admin";

function App() {
  return (
    <AuthProvider>
      <Router>
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
            path="/superAdmin/dashboard"
            element={
              <ProtectedRoute
                element={<SuperAdminDashboard />}
                allowedRoles={["superAdmin"]}
              />
            }
          />

          <Route path="/" element={<UserDashboard />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/admin/edit/:id" element={<EditAdmin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
