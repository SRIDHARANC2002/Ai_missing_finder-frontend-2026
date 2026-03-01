import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import UserDashboard from "../pages/user/UserDashboard";
import CreateComplaint from "../pages/user/CreateComplaint";
import MyComplaints from "../pages/user/MyComplaints";
import Notifications from "../pages/user/Notifications";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Complaints from "../pages/admin/Complaints";
import CompletedCases from "../pages/admin/CompletedCases";
import VerifyUnknown from "../pages/admin/VerifyUnknown";

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/create"
        element={
          <ProtectedRoute role="user">
            <CreateComplaint />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/complaints"
        element={
          <ProtectedRoute role="user">
            <MyComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/notifications"
        element={
          <ProtectedRoute role="user">
            <Notifications />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute role="admin">
            <Complaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/completed"
        element={
          <ProtectedRoute role="admin">
            <CompletedCases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/verify"
        element={
          <ProtectedRoute role="admin">
            <VerifyUnknown />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;