import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import AppLayout from "../layouts/AppLayout";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import PatientsPage from "../pages/patients/PatientsPage";
import MalariaCasesPage from "../pages/malariaCases/MalariaCasesPage";
import FacilitiesPage from "../pages/facilities/FacilitiesPage";
import UsersPage from "../pages/users/UsersPage";
import NotificationsPage from "../pages/dashboard/NotificationsPage";
import ReportsPage from "../pages/reports/ReportsPage";
import RoleRoute from "./RoleRoute";
import UnauthorizedPage from "../pages/UnauthorizedPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/patients"
              element={<PatientsPage />}
            />

            <Route
              path="/malaria-cases"
              element={<MalariaCasesPage />}
            />

            <Route
              path="/facilities"
              element={<FacilitiesPage />}
            />

            <Route
  element={
    <RoleRoute
      allowedRoles={[
        "System Admin",
        "Regional Admin",
        "Zone Admin",
        "District Admin",
      ]}
    />
  }
>
  <Route
    path="/reports"
    element={<ReportsPage />}
  />
</Route>

            <Route element={<RoleRoute allowedRoles={["System Admin"]} />}>
  <Route
    path="/users"
    element={<UsersPage />}
  />
</Route>

            <Route
              path="/notifications"
              element={<NotificationsPage />}
            />
          </Route>
        </Route>
          <Route
  path="/unauthorized"
  element={<UnauthorizedPage />}
/>
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;