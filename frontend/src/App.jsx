import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import authService from "./services/authService";

import Login from "./views/Login/Login";
import Register from "./views/Register/Register";
import ReportForm from "./views/ReportForm/ReportForm";
import ResidentDashboard from "./views/ResidentDashboard/ResidentDashboard";
import OfficialDashboard from "./views/OfficialDashboard/OfficialDashboard";

import "./App.css";

// Route guard: redirect to /login if not authenticated
const PrivateRoute = ({ children, allowedRole }) => {
  if (!authService.isAuthenticated()) return <Navigate to="/login" replace />;
  if (allowedRole) {
    const user = authService.getCurrentUser();
    if (user?.role !== allowedRole) {
      return (
        <Navigate
          to={user?.role === "official" ? "/official/dashboard" : "/dashboard"}
          replace
        />
      );
    }
  }
  return children;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRole="resident">
            <ResidentDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/report/new"
        element={
          <PrivateRoute allowedRole="resident">
            <ReportForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/official/dashboard"
        element={
          <PrivateRoute allowedRole="official">
            <OfficialDashboard />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
