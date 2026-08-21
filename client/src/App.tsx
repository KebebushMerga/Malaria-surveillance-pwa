import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./hooks/AuthContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PatientsPage from "./pages/patients/PatientsPage";
import MalariaCasesPage from "./pages/malariaCases/MalariaCasesPage";
import FacilitiesPage from "./pages/facilities/FacilitiesPage";
import GeographyPage from "./pages/facilities/GeographyPage";
import UsersPage from "./pages/users/UsersPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import ReportsPage from "./pages/dashboard/ReportsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
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
                element={
                  <MalariaCasesPage />
                }
              />

              <Route
                path="/health-facilities"
                element={
                  <FacilitiesPage />
                }
              />

              <Route
                path="/users"
                element={<UsersPage />}
              />

              <Route
                path="/geography"
                element={
                  <GeographyPage />
                }
              />

              <Route
                path="/notifications"
                element={
                  <NotificationsPage />
                }
              />

              <Route
                path="/reports"
                element={<ReportsPage />}
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={<LoginPage />}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;