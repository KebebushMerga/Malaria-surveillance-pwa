import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

const AppLayout = () => {
  const { user, logout } = useAuth();

  const adminRoles = [
    "System Admin",
    "Regional Admin",
    "Zone Admin",
    "District Admin",
  ];

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <div className="app-shell">
      {/* =========================
          SIDEBAR
      ========================= */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img
            src="/malaria-icon.jpg"
            alt="Malaria Surveillance"
          />

          <div>
            <strong>Malaria Surveillance</strong>
            <span>Surveillance System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={navClass}>
            Dashboard
          </NavLink>

          <NavLink to="/patients" className={navClass}>
            Patients
          </NavLink>

          <NavLink
            to="/malaria-cases"
            className={navClass}
          >
            Malaria Cases
          </NavLink>

          <NavLink
            to="/facilities"
            className={navClass}
          >
            Health Facilities
          </NavLink>

          <NavLink
            to="/notifications"
            className={navClass}
          >
            Notifications
          </NavLink>

          <NavLink
            to="/reports"
            className={navClass}
          >
            Reports & Analytics
          </NavLink>

          {adminRoles.includes(user?.role || "") && (
            <NavLink
              to="/users"
              className={navClass}
            >
              Users
            </NavLink>
          )}
        </nav>

        {/* =========================
            SIDEBAR USER
        ========================= */}
        <div className="sidebar-footer">
          <div className="user-summary">
            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.role || "User"}
            </span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN AREA
      ========================= */}
      <div className="main-area">
        {/* TOP BAR */}
        <header className="topbar">
          <div>
            <div className="topbar-title">
              Malaria Surveillance System
            </div>
          </div>

          <div className="topbar-user">
            <NavLink
              to="/notifications"
              className="notification-link"
            >
              Notifications
            </NavLink>

            <span>
              {user?.name || "User"}
            </span>

            <span className="role-badge">
              {user?.role || "User"}
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;