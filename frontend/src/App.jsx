import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import WaterStatus from "./pages/WaterStatus";
import ReportIssue from "./pages/ReportIssue";
import AdminIssues from "./pages/AdminIssues";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./pages/Notifications";
import PlatformAdminDashboard from "./pages/PlatformAdminDashboard";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/water-status"
          element={
            <ProtectedRoute role="resident">
              <WaterStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute role="resident">
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/issues"
          element={
            <ProtectedRoute role="admin">
              <AdminIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute role="resident">
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/platform-admin"
          element={
            <ProtectedRoute role="platformAdmin">
              <PlatformAdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

