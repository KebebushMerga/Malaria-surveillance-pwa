import { useEffect, useMemo, useState } from "react";
import {
  createPatient,
  getPatients,
  type CreatePatientRequest,
  type Patient,
} from "../../services/patientService";

import {
  getRegions,
  getZones,
  getWoredas,
  type Region,
  type Zone,
  type Woreda,
} from "../../services/geographyService";

import {
  getHealthFacilities,
  type HealthFacility,
} from "../../services/healthFacilityService";

const initialForm: CreatePatientRequest = {
  fullName: "",
  sex: "",
  age: 0,
  phone: "",
  region: "",
  zone: "",
  woreda: "",
  facility: "",
};

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [woredas, setWoredas] = useState<Woreda[]>([]);
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);

  const [form, setForm] =
    useState<CreatePatientRequest>(initialForm);

  const [search, setSearch] = useState("");
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
        patientsData,
        regionData,
        zoneData,
        woredaData,
        facilityData,
      ] = await Promise.all([
        getPatients(),
        getRegions(),
        getZones(),
        getWoredas(),
        getHealthFacilities(),
      ]);

      setPatients(patientsData.patients);
      setRegions(regionData.regions);
      setZones(zoneData.zones);
      setWoredas(woredaData.woredas);
      setFacilities(facilityData.facilities);
    } catch (error: any) {
      console.error("Patient data error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load patient data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredZones = useMemo(() => {
    if (!form.region) return zones;

    return zones.filter((zone) => {
      const regionId =
        typeof zone.region === "string"
          ? zone.region
          : zone.region._id;

      return regionId === form.region;
    });
  }, [zones, form.region]);

  const filteredWoredas = useMemo(() => {
    if (!form.zone) return woredas;

    return woredas.filter((woreda) => {
      const zoneId =
        typeof woreda.zone === "string"
          ? woreda.zone
          : woreda.zone._id;

      return zoneId === form.zone;
    });
  }, [woredas, form.zone]);

  const filteredFacilities = useMemo(() => {
    if (!form.woreda) return [];

    return facilities.filter((facility) => {
      const woredaId =
        typeof facility.woreda === "string"
          ? facility.woreda
          : facility.woreda._id;

      return woredaId === form.woreda;
    });
  }, [facilities, form.woreda]);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return patients;

    return patients.filter((patient) => {
      const name =
        patient.fullName ||
        patient.name ||
        "";

      const phone = patient.phone || "";

      return (
        name.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query)
      );
    });
  }, [patients, search]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "age"
          ? Number(value)
          : value,
    }));
  };

  const handleRegionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const region = event.target.value;

    setForm((previous) => ({
      ...previous,
      region,
      zone: "",
      woreda: "",
      facility: "",
    }));
  };

  const handleZoneChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const zone = event.target.value;

    setForm((previous) => ({
      ...previous,
      zone,
      woreda: "",
      facility: "",
    }));
  };

  const handleWoredaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const woreda = event.target.value;

    setForm((previous) => ({
      ...previous,
      woreda,
      facility: "",
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

      await createPatient(form);

      setForm(initialForm);
      setShowForm(false);

      setSuccess(
        "Patient registered successfully."
      );

      await loadData();
    } catch (error: any) {
      console.error("Create patient error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to register patient."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setError("");
  };

  if (loading) {
    return (
      <section>
        <div className="page-header">
          <div>
            <h1>Patients</h1>
            <p>
              Register and manage malaria
              surveillance patients.
            </p>
          </div>
        </div>

        <div className="card">
          <p>Loading patient data...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* PAGE HEADER */}
      <header className="page-header">
        <div>
          <h1>Patients</h1>

          <p>
            Register and manage patient records
            for malaria surveillance.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          style={{
            width: "auto",
            minWidth: "170px",
          }}
          onClick={() => {
            setShowForm((previous) => !previous);
            setError("");
            setSuccess("");
          }}
        >
          {showForm
            ? "Cancel"
            : "+ Register Patient"}
        </button>
      </header>

      {/* MESSAGES */}
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

      {/* SUMMARY */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card-label">
            Total Patients
          </span>

          <strong className="stat-card-value">
            {patients.length}
          </strong>

          <p>
            Registered patient records
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Search Results
          </span>

          <strong className="stat-card-value">
            {filteredPatients.length}
          </strong>

          <p>
            Patients matching your search
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Health Facilities
          </span>

          <strong className="stat-card-value">
            {facilities.length}
          </strong>

          <p>
            Active facilities available
          </p>
        </div>
      </div>

      {/* REGISTRATION FORM */}
      {showForm && (
        <section
          className="card"
          style={{ marginBottom: "24px" }}
        >
          <div className="page-header">
            <div>
              <h2>Register New Patient</h2>

              <p>
                Enter the patient's demographic
                and facility information.
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
                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  className="form-control"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter patient's full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sex">
                  Sex
                </label>

                <select
                  id="sex"
                  className="form-control"
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select sex
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">
                  Age
                </label>

                <input
                  id="age"
                  className="form-control"
                  type="number"
                  name="age"
                  min="0"
                  max="120"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  className="form-control"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="form-group">
                <label htmlFor="region">
                  Region
                </label>

                <select
                  id="region"
                  className="form-control"
                  name="region"
                  value={form.region}
                  onChange={handleRegionChange}
                  required
                >
                  <option value="">
                    Select region
                  </option>

                  {regions.map((region) => (
                    <option
                      key={region._id}
                      value={region._id}
                    >
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="zone">
                  Zone
                </label>

                <select
                  id="zone"
                  className="form-control"
                  name="zone"
                  value={form.zone}
                  onChange={handleZoneChange}
                  disabled={!form.region}
                  required
                >
                  <option value="">
                    {form.region
                      ? "Select zone"
                      : "Select region first"}
                  </option>

                  {filteredZones.map((zone) => (
                    <option
                      key={zone._id}
                      value={zone._id}
                    >
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="woreda">
                  Woreda
                </label>

                <select
                  id="woreda"
                  className="form-control"
                  name="woreda"
                  value={form.woreda}
                  onChange={handleWoredaChange}
                  disabled={!form.zone}
                  required
                >
                  <option value="">
                    {form.zone
                      ? "Select woreda"
                      : "Select zone first"}
                  </option>

                  {filteredWoredas.map(
                    (woreda) => (
                      <option
                        key={woreda._id}
                        value={woreda._id}
                      >
                        {woreda.name}
                      </option>
                    )
                  )}
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
                  disabled={!form.woreda}
                  required
                >
                  <option value="">
                    {form.woreda
                      ? "Select health facility"
                      : "Select woreda first"}
                  </option>

                  {filteredFacilities.map(
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
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                onClick={closeForm}
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
                style={{ width: "auto" }}
                disabled={submitting}
              >
                {submitting
                  ? "Registering..."
                  : "Register Patient"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* PATIENT LIST */}
      <section className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "18px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ marginBottom: "5px" }}>
              Patient Records
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "14px",
              }}
            >
              {filteredPatients.length} patient
              {filteredPatients.length !== 1
                ? "s"
                : ""}{" "}
              displayed
            </p>
          </div>

          <input
            type="search"
            className="form-control"
            style={{
              maxWidth: "330px",
            }}
            placeholder="Search by name or phone..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        {filteredPatients.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "45px 20px",
              color: "#667085",
            }}
          >
            <h3>
              No patients found
            </h3>

            <p>
              {search
                ? "Try a different search term."
                : "No patient records have been registered yet."}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Sex</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Facility</th>
                  <th>Registered</th>
                </tr>
              </thead>

              <tbody>
  {filteredPatients.map((patient) => (
    <tr key={patient._id}>
      <td>
        <strong>
          {patient.fullName ||
            patient.name ||
            "-"}
        </strong>
      </td>

      <td>{patient.sex || "-"}</td>

      <td>{patient.age ?? "-"}</td>

      <td>{patient.phone || "-"}</td>

      <td>
        {typeof patient.facility === "object"
          ? patient.facility.name
          : patient.facility || "-"}
      </td>

      <td>
        {patient.createdAt
          ? new Date(
              patient.createdAt
            ).toLocaleDateString()
          : "-"}
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
};

export default PatientsPage;