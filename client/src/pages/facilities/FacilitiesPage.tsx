import { useEffect, useMemo, useState } from "react";

import {
  createHealthFacility,
  getHealthFacilities,
  type HealthFacility,
} from "../../services/healthFacilityService";

import {
  getWoredas,
  type Woreda,
} from "../../services/geographyService";

const initialForm = {
  name: "",
  code: "",
  woreda: "",
  address: "",
  phone: "",
};

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState<
    HealthFacility[]
  >([]);

  const [woredas, setWoredas] = useState<Woreda[]>(
    []
  );

  const [form, setForm] = useState(initialForm);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("");

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        facilitiesData,
        woredasData,
      ] = await Promise.all([
        getHealthFacilities(),
        getWoredas(),
      ]);

      setFacilities(
        facilitiesData.facilities
      );

      setWoredas(woredasData.woredas);
    } catch (error: any) {
      console.error(
        "Facilities loading error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load health facilities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getWoredaName = (
    woreda:
      | string
      | {
          _id: string;
          name: string;
          code?: string;
        }
  ) => {
    if (typeof woreda === "object") {
      return woreda.name;
    }

    const found = woredas.find(
      (item) => item._id === woreda
    );

    return found?.name || woreda || "-";
  };

  const filteredFacilities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return facilities.filter((facility) => {
      const woredaName =
        getWoredaName(
          facility.woreda
        ).toLowerCase();

      const matchesSearch =
        !query ||
        facility.name
          .toLowerCase()
          .includes(query) ||
        (facility.code || "")
          .toLowerCase()
          .includes(query) ||
        woredaName.includes(query);

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active"
          ? facility.isActive
          : !facility.isActive);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    facilities,
    woredas,
    search,
    statusFilter,
  ]);

  const activeFacilities = facilities.filter(
    (facility) => facility.isActive
  ).length;

  const inactiveFacilities =
    facilities.length - activeFacilities;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createHealthFacility(form);

      setForm(initialForm);
      setShowForm(false);

      setSuccess(
        "Health facility created successfully."
      );

      await loadData();
    } catch (error: any) {
      console.error(
        "Create facility error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create health facility."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section>
        <header className="page-header">
          <div>
            <h1>Health Facilities</h1>
            <p>
              Manage facilities participating in
              malaria surveillance.
            </p>
          </div>
        </header>

        <div className="card">
          <p>Loading facilities...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Health Facilities</h1>

          <p>
            Manage health facilities participating
            in malaria surveillance.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          style={{
            width: "auto",
            minWidth: "160px",
          }}
          onClick={() => {
            setShowForm((previous) => !previous);
            setError("");
            setSuccess("");
          }}
        >
          {showForm
            ? "Cancel"
            : "+ Add Facility"}
        </button>
      </header>

      {/* ALERTS */}
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
            Total Facilities
          </span>

          <strong className="stat-card-value">
            {facilities.length}
          </strong>

          <p>
            Registered health facilities
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Active
          </span>

          <strong className="stat-card-value">
            {activeFacilities}
          </strong>

          <p>
            Currently active facilities
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Inactive
          </span>

          <strong className="stat-card-value">
            {inactiveFacilities}
          </strong>

          <p>
            Currently inactive facilities
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Woredas
          </span>

          <strong className="stat-card-value">
            {woredas.length}
          </strong>

          <p>
            Geographic areas represented
          </p>
        </div>
      </div>

      {/* ADD FACILITY */}
      {showForm && (
        <section
          className="card"
          style={{
            marginBottom: "24px",
          }}
        >
          <div className="page-header">
            <div>
              <h2>Add Health Facility</h2>

              <p>
                Register a facility and associate it
                with its woreda.
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
                <label htmlFor="facility-name">
                  Facility Name
                </label>

                <input
                  id="facility-name"
                  className="form-control"
                  type="text"
                  value={form.name}
                  placeholder="e.g. Addis Health Center"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="facility-code">
                  Facility Code
                </label>

                <input
                  id="facility-code"
                  className="form-control"
                  type="text"
                  value={form.code}
                  placeholder="Optional facility code"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      code: event.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="facility-woreda">
                  Woreda
                </label>

                <select
                  id="facility-woreda"
                  className="form-control"
                  value={form.woreda}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      woreda:
                        event.target.value,
                    })
                  }
                  required
                >
                  <option value="">
                    Select woreda
                  </option>

                  {woredas.map((woreda) => (
                    <option
                      key={woreda._id}
                      value={woreda._id}
                    >
                      {woreda.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="facility-phone">
                  Phone
                </label>

                <input
                  id="facility-phone"
                  className="form-control"
                  type="tel"
                  value={form.phone}
                  placeholder="Optional phone number"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      phone: event.target.value,
                    })
                  }
                />
              </div>

              <div
                className="form-group"
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >
                <label htmlFor="facility-address">
                  Address
                </label>

                <input
                  id="facility-address"
                  className="form-control"
                  type="text"
                  value={form.address}
                  placeholder="Facility address"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      address:
                        event.target.value,
                    })
                  }
                />
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
                  ? "Saving..."
                  : "Save Facility"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* FACILITY LIST */}
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
              Facility Directory
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Showing{" "}
              {filteredFacilities.length} of{" "}
              {facilities.length} facilities
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
                minWidth: "240px",
              }}
              placeholder="Search facilities..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              className="form-control"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="">
                All statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {filteredFacilities.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              color: "#667085",
            }}
          >
            <h3>
              No facilities found
            </h3>

            <p>
              {search || statusFilter
                ? "Try changing your search or filter."
                : "No health facilities have been registered yet."}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Code</th>
                  <th>Woreda</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredFacilities.map(
                  (facility) => (
                    <tr key={facility._id}>
                      <td>
                        <strong>
                          {facility.name}
                        </strong>
                      </td>

                      <td>
                        {facility.code || "-"}
                      </td>

                      <td>
                        {getWoredaName(
                          facility.woreda
                        )}
                      </td>

                      <td>
                        {facility.address || "-"}
                      </td>

                      <td>
                        {facility.phone || "-"}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            facility.isActive
                              ? "status-success"
                              : "status-inactive"
                          }`}
                        >
                          {facility.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
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

export default FacilitiesPage;