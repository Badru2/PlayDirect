import React from "react";
import AdminNavigation from "../../components/navigations/admin-navigation";
import CreateCategoryProduct from "../../components/admin/create-category-product";
import CreateGenreProduct from "../../components/admin/create-genre-product";
import CreateProduct from "../../components/admin/create-product";

const AdminDashboard = () => {
  return (
    <div>
      <AdminNavigation />
      {/* <CreateCategoryProduct />
      <CreateGenreProduct /> */}
      <CreateProduct />
    </div>
  );
};

export default AdminDashboard;
