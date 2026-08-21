import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

import { getPatients } from "../../services/patientService";
import { getMalariaCases } from "../../services/malariaCaseService";
import { getHealthFacilities } from "../../services/healthFacilityService";
import { getNotifications } from "../../services/notificationService";

interface DashboardStats {
  patients: number;
  malariaCases: number;
  facilities: number;
  notifications: number;
  confirmedCases: number;
  suspectedCases: number;
  underTreatment: number;
}

const DashboardPage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    patients: 0,
    malariaCases: 0,
    facilities: 0,
    notifications: 0,
    confirmedCases: 0,
    suspectedCases: 0,
    underTreatment: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          patientsData,
          malariaCasesData,
          facilitiesData,
          notificationsData,
        ] = await Promise.all([
          getPatients(),
          getMalariaCases(),
          getHealthFacilities(),
          getNotifications(),
        ]);

        const malariaCases = malariaCasesData.cases || [];

        setStats({
          patients: patientsData.count,
          malariaCases: malariaCasesData.count,
          facilities: facilitiesData.count,
          notifications: notificationsData.count,

          confirmedCases: malariaCases.filter(
            (item) => item.diagnosis === "Confirmed"
          ).length,

          suspectedCases: malariaCases.filter(
            (item) => item.diagnosis === "Suspected"
          ).length,

          underTreatment: malariaCases.filter(
            (item) => item.outcome === "Under Treatment"
          ).length,
        });
      } catch (error: any) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <section>
      {/* =========================
          HEADER
      ========================= */}

      <header className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome back,{" "}
            <strong>
              {user?.name || "User"}
            </strong>
            . Here's your malaria surveillance
            overview.
          </p>
        </div>

        <span className="role-badge">
          {user?.role || "User"}
        </span>
      </header>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* =========================
          MAIN STATISTICS
      ========================= */}

      {loading ? (
        <div className="card">
          <p>
            Loading surveillance statistics...
          </p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-card-label">
                Total Patients
              </span>

              <strong className="stat-card-value">
                {stats.patients}
              </strong>

              <p>
                Registered patient records
              </p>
            </div>

            <div className="stat-card">
              <span className="stat-card-label">
                Malaria Cases
              </span>

              <strong className="stat-card-value">
                {stats.malariaCases}
              </strong>

              <p>
                Reported surveillance cases
              </p>
            </div>

            <div className="stat-card">
              <span className="stat-card-label">
                Health Facilities
              </span>

              <strong className="stat-card-value">
                {stats.facilities}
              </strong>

              <p>
                Facilities connected to the system
              </p>
            </div>

            <div className="stat-card">
              <span className="stat-card-label">
                Notifications
              </span>

              <strong className="stat-card-value">
                {stats.notifications}
              </strong>

              <p>
                System notifications
              </p>
            </div>
          </div>

          {/* =========================
              CASE STATUS
          ========================= */}

          <section
            className="card"
            style={{ marginBottom: "24px" }}
          >
            <div className="page-header">
              <div>
                <h2>
                  Malaria Case Status
                </h2>

                <p>
                  Current distribution of
                  reported malaria cases.
                </p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="report-card">
                <span>Confirmed Cases</span>

                <strong>
                  {stats.confirmedCases}
                </strong>

                <span>
                  Confirmed malaria cases.
                </span>
              </div>

              <div className="report-card">
                <span>Suspected Cases</span>

                <strong>
                  {stats.suspectedCases}
                </strong>

                <span>
                  Cases awaiting confirmation.
                </span>
              </div>

              <div className="report-card">
                <span>Under Treatment</span>

                <strong>
                  {stats.underTreatment}
                </strong>

                <span>
                  Patients currently receiving
                  treatment.
                </span>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =========================
          QUICK ACTIONS
      ========================= */}

      <section
        className="card"
        style={{ marginBottom: "24px" }}
      >
        <div className="page-header">
          <div>
            <h2>Quick Actions</h2>

            <p>
              Quickly access common surveillance
              activities.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          <NavLink
            to="/patients"
            className="quick-action"
          >
            <strong>
              Register Patient
            </strong>

            <span>
              Add a new patient record
            </span>
          </NavLink>

          <NavLink
            to="/malaria-cases"
            className="quick-action"
          >
            <strong>
              Register Malaria Case
            </strong>

            <span>
              Record a new malaria case
            </span>
          </NavLink>

          <NavLink
            to="/facilities"
            className="quick-action"
          >
            <strong>
              Health Facilities
            </strong>

            <span>
              Manage health facilities
            </span>
          </NavLink>

          <NavLink
            to="/reports"
            className="quick-action"
          >
            <strong>
              Reports & Analytics
            </strong>

            <span>
              View surveillance reports
            </span>
          </NavLink>

          <NavLink
            to="/notifications"
            className="quick-action"
          >
            <strong>
              Notifications
            </strong>

            <span>
              Review system alerts
            </span>
          </NavLink>
        </div>
      </section>

      {/* =========================
          SYSTEM OVERVIEW
      ========================= */}

      <section>
        <div className="page-header">
          <div>
            <h2>
              Surveillance System Overview
            </h2>

            <p>
              Current coverage and activity
              across the malaria surveillance
              system.
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="report-card">
            <span>Patient Records</span>

            <strong>
              {stats.patients}
            </strong>

            <span>
              Patients registered in the
              surveillance database.
            </span>
          </div>

          <div className="report-card">
            <span>Reported Cases</span>

            <strong>
              {stats.malariaCases}
            </strong>

            <span>
              Malaria cases reported by
              participating facilities.
            </span>
          </div>

          <div className="report-card">
            <span>Facility Network</span>

            <strong>
              {stats.facilities}
            </strong>

            <span>
              Health facilities currently
              available in the system.
            </span>
          </div>
        </div>
      </section>
    </section>
  );
};

export default DashboardPage;