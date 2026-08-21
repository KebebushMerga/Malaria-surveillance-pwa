import { useEffect, useMemo, useState } from "react";

import {
  getPatients,
  type Patient,
} from "../../services/patientService";

import {
  getMalariaCases,
  type MalariaCase,
} from "../../services/malariaCaseService";

import {
  getHealthFacilities,
  type HealthFacility,
} from "../../services/healthFacilityService";

type ReportFilter = "all" | "30days" | "7days";

const ReportsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [malariaCases, setMalariaCases] =
    useState<MalariaCase[]>([]);
  const [facilities, setFacilities] =
    useState<HealthFacility[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] =
    useState<ReportFilter>("all");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        patientsData,
        malariaCasesData,
        facilitiesData,
      ] = await Promise.all([
        getPatients(),
        getMalariaCases(),
        getHealthFacilities(),
      ]);

      setPatients(patientsData.patients);
      setMalariaCases(malariaCasesData.cases);
      setFacilities(facilitiesData.facilities);
    } catch (error: any) {
      console.error("Reports loading error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredCases = useMemo(() => {
    if (filter === "all") {
      return malariaCases;
    }

    const days = filter === "7days" ? 7 : 30;

    const cutoff = new Date();

    cutoff.setDate(
      cutoff.getDate() - days
    );

    return malariaCases.filter((malariaCase) => {
      if (!malariaCase.createdAt) {
        return false;
      }

      return (
        new Date(malariaCase.createdAt) >=
        cutoff
      );
    });
  }, [malariaCases, filter]);

  const malePatients = useMemo(
    () =>
      patients.filter(
        (patient) =>
          patient.sex?.toLowerCase() ===
          "male"
      ).length,
    [patients]
  );

  const femalePatients = useMemo(
    () =>
      patients.filter(
        (patient) =>
          patient.sex?.toLowerCase() ===
          "female"
      ).length,
    [patients]
  );

  const otherPatients =
    patients.length -
    malePatients -
    femalePatients;

  const activeFacilities = useMemo(
    () =>
      facilities.filter(
        (facility) => facility.isActive
      ).length,
    [facilities]
  );

  const inactiveFacilities =
    facilities.length - activeFacilities;

  const recentCases = useMemo(() => {
    return [...filteredCases]
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 10);
  }, [filteredCases]);

  const casesByStatus = useMemo(() => {
    const result: Record<string, number> = {};

    filteredCases.forEach((malariaCase) => {
      const status =
        (malariaCase as any).status ||
        "Unknown";

      result[status] =
        (result[status] || 0) + 1;
    });

    return Object.entries(result).sort(
      (a, b) => b[1] - a[1]
    );
  }, [filteredCases]);

  const casesByFacility = useMemo(() => {
    const result: Record<string, number> = {};

    filteredCases.forEach((malariaCase) => {
      let facilityName = "Unknown facility";

      if (
        typeof malariaCase.facility ===
        "object" &&
        malariaCase.facility
      ) {
        facilityName =
          malariaCase.facility.name;
      } else if (malariaCase.facility) {
        facilityName = String(
          malariaCase.facility
        );
      }

      result[facilityName] =
        (result[facilityName] || 0) + 1;
    });

    return Object.entries(result)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filteredCases]);

  if (loading) {
    return (
      <section>
        <header className="page-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p>
              Loading surveillance analytics...
            </p>
          </div>
        </header>

        <div className="card">
          <p>Loading reports...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <h1>Reports & Analytics</h1>

          <p>
            Monitor malaria surveillance
            activity, patient demographics,
            facilities, and reported cases.
          </p>
        </div>

        <button
          type="button"
          onClick={loadReports}
          className="primary-button"
        >
          Refresh Data
        </button>
      </header>

      {/* ERROR */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* FILTER */}
      <div
        className="card"
        style={{
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3
              style={{
                margin: "0 0 5px",
              }}
            >
              Reporting Period
            </h3>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Choose the period used for case
              analytics.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "filter-button active"
                  : "filter-button"
              }
            >
              All Time
            </button>

            <button
              type="button"
              onClick={() =>
                setFilter("30days")
              }
              className={
                filter === "30days"
                  ? "filter-button active"
                  : "filter-button"
              }
            >
              Last 30 Days
            </button>

            <button
              type="button"
              onClick={() =>
                setFilter("7days")
              }
              className={
                filter === "7days"
                  ? "filter-button active"
                  : "filter-button"
              }
            >
              Last 7 Days
            </button>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card-label">
            Total Patients
          </span>

          <strong className="stat-card-value">
            {patients.length}
          </strong>

          <p>
            Registered patients
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Malaria Cases
          </span>

          <strong className="stat-card-value">
            {filteredCases.length}
          </strong>

          <p>
            Cases in selected period
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Active Facilities
          </span>

          <strong className="stat-card-value">
            {activeFacilities}
          </strong>

          <p>
            Currently active
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Facility Coverage
          </span>

          <strong className="stat-card-value">
            {facilities.length}
          </strong>

          <p>
            Total registered facilities
          </p>
        </div>
      </div>

      {/* DEMOGRAPHICS + FACILITIES */}
      <div className="report-grid">
        <div className="report-panel">
          <div className="panel-header">
            <div>
              <h2>
                Patient Demographics
              </h2>

              <p>
                Registered patient distribution
              </p>
            </div>
          </div>

          <div className="demographic-list">
            <div className="demographic-row">
              <div>
                <span className="dot male-dot" />
                Male
              </div>

              <strong>
                {malePatients}
              </strong>
            </div>

            <div className="demographic-row">
              <div>
                <span className="dot female-dot" />
                Female
              </div>

              <strong>
                {femalePatients}
              </strong>
            </div>

            <div className="demographic-row">
              <div>
                <span className="dot other-dot" />
                Other / Not specified
              </div>

              <strong>
                {otherPatients}
              </strong>
            </div>
          </div>
        </div>

        <div className="report-panel">
          <div className="panel-header">
            <div>
              <h2>
                Facility Status
              </h2>

              <p>
                Current health facility status
              </p>
            </div>
          </div>

          <div className="facility-summary">
            <div className="facility-summary-item">
              <strong>
                {activeFacilities}
              </strong>

              <span>
                Active facilities
              </span>
            </div>

            <div className="facility-summary-item">
              <strong>
                {inactiveFacilities}
              </strong>

              <span>
                Inactive facilities
              </span>
            </div>
          </div>

          <div className="coverage-bar">
            <div
              style={{
                width:
                  facilities.length > 0
                    ? `${
                        (activeFacilities /
                          facilities.length) *
                        100
                      }%`
                    : "0%",
              }}
            />
          </div>

          <p className="coverage-text">
            {facilities.length > 0
              ? `${Math.round(
                  (activeFacilities /
                    facilities.length) *
                    100
                )}% of facilities are active`
              : "No facilities registered"}
          </p>
        </div>
      </div>

      {/* CASE STATUS + FACILITY DISTRIBUTION */}
      <div className="report-grid">
        <div className="report-panel">
          <div className="panel-header">
            <div>
              <h2>
                Cases by Status
              </h2>

              <p>
                Distribution of reported cases
              </p>
            </div>
          </div>

          {casesByStatus.length === 0 ? (
            <div className="empty-report">
              No cases available for this
              period.
            </div>
          ) : (
            <div className="analytics-list">
              {casesByStatus.map(
                ([status, count]) => {
                  const percentage =
                    filteredCases.length > 0
                      ? (count /
                          filteredCases.length) *
                        100
                      : 0;

                  return (
                    <div
                      className="analytics-item"
                      key={status}
                    >
                      <div className="analytics-label">
                        <span>
                          {status}
                        </span>

                        <strong>
                          {count}
                        </strong>
                      </div>

                      <div className="analytics-bar">
                        <div
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>

        <div className="report-panel">
          <div className="panel-header">
            <div>
              <h2>
                Cases by Facility
              </h2>

              <p>
                Facilities with the most reported
                cases
              </p>
            </div>
          </div>

          {casesByFacility.length === 0 ? (
            <div className="empty-report">
              No facility case data available.
            </div>
          ) : (
            <div className="analytics-list">
              {casesByFacility.map(
                ([facility, count]) => (
                  <div
                    className="analytics-item"
                    key={facility}
                  >
                    <div className="analytics-label">
                      <span>
                        {facility}
                      </span>

                      <strong>
                        {count}
                      </strong>
                    </div>

                    <div className="analytics-bar">
                      <div
                        style={{
                          width: `${
                            filteredCases.length >
                            0
                              ? (count /
                                  filteredCases.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* RECENT CASES */}
      <div className="report-panel">
        <div className="panel-header">
          <div>
            <h2>
              Recent Malaria Cases
            </h2>

            <p>
              Latest surveillance records in the
              selected period
            </p>
          </div>

          <span className="status-success">
            {filteredCases.length} total
          </span>
        </div>

        {recentCases.length === 0 ? (
          <div className="empty-report">
            No malaria cases have been recorded
            for this period.
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Status</th>
                  <th>Facility</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentCases.map(
                  (malariaCase) => (
                    <tr
                      key={malariaCase._id}
                    >
                      <td>
                        {typeof malariaCase.patient ===
                        "object"
                          ? malariaCase.patient.fullName ||
                            malariaCase.patient.name
                          : malariaCase.patient}
                      </td>

                      <td>
                        <span className="case-status">
                          {(malariaCase as any)
                            .status || "-"}
                        </span>
                      </td>

                      <td>
                        {typeof malariaCase.facility ===
                        "object"
                          ? malariaCase.facility.name
                          : malariaCase.facility ||
                            "-"}
                      </td>

                      <td>
                        {malariaCase.createdAt
                          ? new Date(
                              malariaCase.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportsPage;