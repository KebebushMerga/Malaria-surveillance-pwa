import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

interface MenuItem {
  label: string;
  path: string;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },

  {
    label: "Patients",
    path: "/patients",
  },

  {
    label: "Malaria Cases",
    path: "/malaria-cases",
  },

  {
    label: "Health Facilities",
    path: "/health-facilities",
  },

  {
    label: "Users",
    path: "/users",
    roles: [
      "System Admin",
      "Regional Admin",
      "Zone Admin",
      "District Admin",
    ],
  },

  {
    label: "Geography",
    path: "/geography",
    roles: [
      "System Admin",
      "Regional Admin",
      "Zone Admin",
      "District Admin",
    ],
  },

  {
    label: "Notifications",
    path: "/notifications",
  },

  {
    label: "Reports",
    path: "/reports",
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();

  const visibleItems =
    menuItems.filter((item) => {
      if (!item.roles) {
        return true;
      }

      return user?.role
        ? item.roles.includes(user.role)
        : false;
    });

  return (
    <aside>
      <header>
        <h2>Malaria Surveillance</h2>
      </header>

      <nav>
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <footer>
        <p>{user?.name}</p>

        <p>{user?.role}</p>

        <button
          type="button"
          onClick={logout}
        >
          Logout
        </button>
      </footer>
    </aside>
  );
};

export default Sidebar;