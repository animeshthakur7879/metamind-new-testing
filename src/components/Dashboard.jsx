// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
        {user ? (
          <div>
            <p>Welcome, {user.email}!</p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 hover:bg-red-400 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Please log in to view your dashboard.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
