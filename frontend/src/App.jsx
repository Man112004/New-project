import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RaiseComplaintPage from "./pages/citizen/RaiseComplaintPage";
import MyComplaintsPage from "./pages/citizen/MyComplaintsPage";
import ComplaintDetailsPage from "./pages/citizen/ComplaintDetailsPage";
import MapComplaintsPage from "./pages/citizen/MapComplaintsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminComplaintsPage from "./pages/admin/AdminComplaintsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/raise-complaint"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <RaiseComplaintPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <MyComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/:id"
          element={
            <ProtectedRoute roles={["CITIZEN", "ADMIN", "OFFICER"]}>
              <ComplaintDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute roles={["CITIZEN", "ADMIN", "OFFICER"]}>
              <MapComplaintsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["CITIZEN", "ADMIN", "OFFICER"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN", "OFFICER"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="complaints" element={<AdminComplaintsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}
