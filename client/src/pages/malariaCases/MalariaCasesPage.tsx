import { useEffect, useMemo, useState } from "react";

import {
  createMalariaCase,
  getMalariaCases,
  type MalariaCase,
  type CreateMalariaCaseRequest,
} from "../../services/malariaCaseService";

import {
  getPatients,
  type Patient,
} from "../../services/patientService";

import {
  getHealthFacilities,
  type HealthFacility,
} from "../../services/healthFacilityService";

const initialForm: CreateMalariaCaseRequest = {
  patient: "",
  facility: "",
  diagnosisDate: "",
  diagnosis: "",
  malariaSpecies: "",
  treatment: "",
  outcome: "",
};

const MalariaCasesPage = () => {
  const [cases, setCases] = useState<MalariaCase[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [facilities, setFacilities] = useState<
    HealthFacility[]
  >([]);

  const [form, setForm] =
    useState<CreateMalariaCaseRequest>(initialForm);

  const [search, setSearch] = useState("");
  const [diagnosisFilter, setDiagnosisFilter] =
    useState("");

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        casesData,
        patientsData,
        facilitiesData,
      ] = await Promise.all([
        getMalariaCases(),
        getPatients(),
        getHealthFacilities(),
      ]);

      setCases(casesData.cases);
      setPatients(patientsData.patients);
      setFacilities(facilitiesData.facilities);
    } catch (error: any) {
      console.error(
        "Malaria cases loading error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load malaria surveillance data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createMalariaCase(form);

      setForm(initialForm);
      setShowForm(false);

      setSuccess(
        "Malaria case registered successfully."
      );

      await loadData();
    } catch (error: any) {
      console.error(
        "Create malaria case error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to register malaria case."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getPatientName = (
    patient:
      | string
      | {
          _id: string;
          fullName?: string;
          name?: string;
        }
  ) => {
    if (typeof patient === "string") {
      const found = patients.find(
        (item) => item._id === patient
      );

      return (
        found?.fullName ||
        found?.name ||
        patient
      );
    }

    return (
      patient.fullName ||
      patient.name ||
      patient._id
    );
  };

  const getFacilityName = (
    facility:
      | string
      | {
          _id: string;
          name: string;
        }
  ) => {
    if (typeof facility === "string") {
      const found = facilities.find(
        (item) => item._id === facility
      );

      return found?.name || facility;
    }

    return facility.name;
  };

  const filteredCases = useMemo(() => {
    const query = search.trim().toLowerCase();

    return cases.filter((malariaCase) => {
      const patientName = getPatientName(
        malariaCase.patient
      ).toLowerCase();

      const facilityName = getFacilityName(
        malariaCase.facility
      ).toLowerCase();

      const matchesSearch =
        !query ||
        patientName.includes(query) ||
        facilityName.includes(query) ||
        (
          malariaCase.malariaSpecies || ""
        )
          .toLowerCase()
          .includes(query);

      const matchesDiagnosis =
        !diagnosisFilter ||
        malariaCase.diagnosis === diagnosisFilter;

      return (
        matchesSearch &&
        matchesDiagnosis
      );
    });
  }, [
    cases,
    patients,
    facilities,
    search,
    diagnosisFilter,
  ]);

  const confirmedCases = cases.filter(
    (item) => item.diagnosis === "Confirmed"
  ).length;

  const suspectedCases = cases.filter(
    (item) => item.diagnosis === "Suspected"
  ).length;

  const activeTreatmentCases = cases.filter(
    (item) => item.outcome === "Under Treatment"
  ).length;

  if (loading) {
    return (
      <section>
        <header className="page-header">
          <div>
            <h1>Malaria Cases</h1>

            <p>
              Monitor and manage malaria cases
              reported by health facilities.
            </p>
          </div>
        </header>

        <div className="card">
          <p>
            Loading malaria surveillance data...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* =========================
          PAGE HEADER
      ========================= */}
      <header className="page-header">
        <div>
          <h1>Malaria Cases</h1>

          <p>
            Monitor and manage malaria cases
            reported by health facilities.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          style={{
            width: "auto",
            minWidth: "190px",
          }}
          onClick={() => {
            setShowForm((previous) => !previous);
            setError("");
            setSuccess("");
          }}
        >
          {showForm
            ? "Cancel"
            : "+ Register Malaria Case"}
        </button>
      </header>

      {/* =========================
          ALERTS
      ========================= */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* =========================
          STATISTICS
      ========================= */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card-label">
            Total Cases
          </span>

          <strong className="stat-card-value">
            {cases.length}
          </strong>

          <p>
            All recorded malaria cases
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Confirmed
          </span>

          <strong className="stat-card-value">
            {confirmedCases}
          </strong>

          <p>
            Laboratory/clinically confirmed
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Suspected
          </span>

          <strong className="stat-card-value">
            {suspectedCases}
          </strong>

          <p>
            Suspected malaria cases
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Under Treatment
          </span>

          <strong className="stat-card-value">
            {activeTreatmentCases}
          </strong>

          <p>
            Patients currently receiving treatment
          </p>
        </div>
      </div>

      {/* =========================
          REGISTRATION FORM
      ========================= */}
      {showForm && (
        <section
          className="card"
          style={{
            marginBottom: "24px",
          }}
        >
          <div className="page-header">
            <div>
              <h2>
                Register Malaria Case
              </h2>

              <p>
                Record diagnosis and treatment
                information for a patient.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "18px",
              }}
            >
              <div className="form-group">
                <label htmlFor="patient">
                  Patient
                </label>

                <select
                  id="patient"
                  className="form-control"
                  name="patient"
                  value={form.patient}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select patient
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient._id}
                      value={patient._id}
                    >
                      {patient.fullName ||
                        patient.name ||
                        patient._id}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="facility">
                  Health Facility
                </label>

                <select
                  id="facility"
                  className="form-control"
                  name="facility"
                  value={form.facility}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select health facility
                  </option>

                  {facilities.map(
                    (facility) => (
                      <option
                        key={facility._id}
                        value={facility._id}
                      >
                        {facility.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="diagnosisDate">
                  Diagnosis Date
                </label>

                <input
                  id="diagnosisDate"
                  className="form-control"
                  type="date"
                  name="diagnosisDate"
                  value={form.diagnosisDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="diagnosis">
                  Diagnosis
                </label>

                <select
                  id="diagnosis"
                  className="form-control"
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                >
                  <option value="">
                    Select diagnosis
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Suspected">
                    Suspected
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="malariaSpecies">
                  Malaria Species
                </label>

                <select
                  id="malariaSpecies"
                  className="form-control"
                  name="malariaSpecies"
                  value={form.malariaSpecies}
                  onChange={handleChange}
                >
                  <option value="">
                    Select species
                  </option>

                  <option value="P. falciparum">
                    P. falciparum
                  </option>

                  <option value="P. vivax">
                    P. vivax
                  </option>

                  <option value="Mixed">
                    Mixed
                  </option>

                  <option value="Unknown">
                    Unknown
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="treatment">
                  Treatment
                </label>

                <input
                  id="treatment"
                  className="form-control"
                  type="text"
                  name="treatment"
                  placeholder="Treatment provided"
                  value={form.treatment}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="outcome">
                  Outcome
                </label>

                <select
                  id="outcome"
                  className="form-control"
                  name="outcome"
                  value={form.outcome}
                  onChange={handleChange}
                >
                  <option value="">
                    Select outcome
                  </option>

                  <option value="Recovered">
                    Recovered
                  </option>

                  <option value="Under Treatment">
                    Under Treatment
                  </option>

                  <option value="Referred">
                    Referred
                  </option>

                  <option value="Deceased">
                    Deceased
                  </option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                }}
                style={{
                  padding: "12px 18px",
                  borderRadius: "9px",
                  border:
                    "1px solid #d0d5dd",
                  background: "white",
                  color: "#344054",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                style={{
                  width: "auto",
                }}
                disabled={submitting}
              >
                {submitting
                  ? "Registering..."
                  : "Register Case"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* =========================
          CASE LIST
      ========================= */}
      <section className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2
              style={{
                marginBottom: "5px",
              }}
            >
              Recorded Cases
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Showing {filteredCases.length} of{" "}
              {cases.length} cases
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="search"
              className="form-control"
              style={{
                minWidth: "230px",
              }}
              placeholder="Search patient, facility..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              className="form-control"
              value={diagnosisFilter}
              onChange={(event) =>
                setDiagnosisFilter(
                  event.target.value
                )
              }
            >
              <option value="">
                All diagnoses
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Suspected">
                Suspected
              </option>
            </select>
          </div>
        </div>

        {filteredCases.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              color: "#667085",
            }}
          >
            <h3>
              No malaria cases found
            </h3>

            <p>
              {search || diagnosisFilter
                ? "Try changing your search or filter."
                : "No malaria cases have been registered yet."}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Facility</th>
                  <th>Diagnosis Date</th>
                  <th>Diagnosis</th>
                  <th>Species</th>
                  <th>Treatment</th>
                  <th>Outcome</th>
                </tr>
              </thead>

              <tbody>
                {filteredCases.map(
                  (malariaCase) => (
                    <tr key={malariaCase._id}>
                      <td>
                        <strong>
                          {getPatientName(
                            malariaCase.patient
                          )}
                        </strong>
                      </td>

                      <td>
                        {getFacilityName(
                          malariaCase.facility
                        )}
                      </td>

                      <td>
                        {malariaCase.diagnosisDate
                          ? new Date(
                              malariaCase.diagnosisDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            malariaCase.diagnosis ===
                            "Confirmed"
                              ? "status-danger"
                              : "status-warning"
                          }`}
                        >
                          {malariaCase.diagnosis ||
                            "Not specified"}
                        </span>
                      </td>

                      <td>
                        {malariaCase.malariaSpecies ||
                          "-"}
                      </td>

                      <td>
                        {malariaCase.treatment ||
                          "-"}
                      </td>

                      <td>
                        {malariaCase.outcome ||
                          "-"}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
};

export default MalariaCasesPage;