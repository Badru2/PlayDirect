import React, { useState, useEffect } from "react";
import AdminNavigation from "../../components/navigations/admin-navigation";
import axios from "axios";
import TransactionChart from "../../components/charts/TransactionChart";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions
  const fetchTransaction = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/transaction/show");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Error fetching transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen">
        <AdminNavigation />
        <div className="w-4/5">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminNavigation />
        <div className="w-4/5">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-1/5">
        <AdminNavigation />
      </div>
      <div className="w-4/5 p-4">
        <div>
          <div className="w-1/4 shadow-md p-3 bg-white">
            <TransactionChart transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
