import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const citizenLinks = [
  { to: "/raise-complaint", label: "Raise Complaint" },
  { to: "/my-complaints", label: "My Complaints" },
  { to: "/map", label: "Map" }
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Admin Dashboard" },
  { to: "/admin/reports", label: "Reports" }
];

export default function AppLayout() {
  const { auth, logout, isAuthenticated } = useAuth();
  const role = auth?.role;

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Complaint App
        </Link>
        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          {role === "CITIZEN" && citizenLinks.map((item) => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}
          {(role === "ADMIN" || role === "OFFICER") &&
            adminLinks.map((item) => <NavLink key={item.to} to={item.to}>{item.label}</NavLink>)}
          {isAuthenticated && <NavLink to="/profile">Profile</NavLink>}
        </nav>
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-pill">{auth.name}</span>
              <button className="ghost-btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="ghost-btn" to="/login">Login</Link>
              <Link className="primary-btn" to="/register">Register</Link>
            </>
          )}
        </div>
      </header>
      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}
