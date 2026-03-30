import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/complaints", label: "Complaints" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/settings", label: "Settings" }
];

export default function AdminLayout() {
  const { auth, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("smartcivic-admin-theme") || "light");

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("smartcivic-admin-theme", theme);
    return () => {
      document.body.dataset.theme = "light";
    };
  }, [theme]);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-kicker">Control Room</span>
          <h2>Smart Civic Admin</h2>
        </div>
        <nav className="admin-nav">
          {adminLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className="admin-nav-link">
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <p>{auth?.name}</p>
          <span>{auth?.role}</span>
          <button className="ghost-btn" onClick={logout}>Logout</button>
        </div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Smart Civic Complaint Management</p>
            <h1>Municipal governance workspace</h1>
          </div>
          <div className="row-actions">
            <button
              className="ghost-btn"
              onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </header>
        <div className="admin-page-content">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
