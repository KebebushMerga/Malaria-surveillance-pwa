import { useEffect, useMemo, useState } from "react";

import {
  getUsers,
  createUser,
  type User,
} from "../../services/userService";

import {
  getHealthFacilities,
  type HealthFacility,
} from "../../services/healthFacilityService";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "",
  facility: "",
};

const roles = [
  "System Admin",
  "Regional Admin",
  "Zone Admin",
  "District Admin",
  "Health Facility User",
];

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [facilities, setFacilities] = useState<
    HealthFacility[]
  >([]);

  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersData, facilitiesData] =
        await Promise.all([
          getUsers(),
          getHealthFacilities(),
        ]);

      setUsers(usersData.users);
      setFacilities(facilitiesData.facilities);
    } catch (error: any) {
      console.error("Users loading error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getRoleName = (role: User["role"]) => {
    return typeof role === "object"
      ? role.name
      : role;
  };

  const getFacilityName = (
    facility: User["facility"]
  ) => {
    if (typeof facility === "object") {
      return facility.name;
    }

    const found = facilities.find(
      (item) => item._id === facility
    );

    return found?.name || facility || "-";
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const role = getRoleName(user.role);
      const facility = getFacilityName(user.facility);

      const matchesSearch =
        !query ||
        user.name
          .toLowerCase()
          .includes(query) ||
        user.email
          .toLowerCase()
          .includes(query) ||
        role.toLowerCase().includes(query) ||
        facility.toLowerCase().includes(query);

      const matchesRole =
        !roleFilter || role === roleFilter;

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active"
          ? user.isActive
          : !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    facilities,
    search,
    roleFilter,
    statusFilter,
  ]);

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length;

  const inactiveUsers =
    users.length - activeUsers;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createUser(form);

      setForm(initialForm);
      setShowForm(false);

      setSuccess(
        "User created successfully."
      );

      await loadData();
    } catch (error: any) {
      console.error(
        "Create user error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create user."
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
            <h1>Users</h1>
            <p>
              Manage system users and access
              permissions.
            </p>
          </div>
        </header>

        <div className="card">
          <p>Loading users...</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* HEADER */}
      <header className="page-header">
        <div>
          <h1>Users</h1>

          <p>
            Manage system users, roles, and
            facility access.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          style={{
            width: "auto",
            minWidth: "145px",
          }}
          onClick={() => {
            setShowForm((previous) => !previous);
            setError("");
            setSuccess("");
          }}
        >
          {showForm
            ? "Cancel"
            : "+ Create User"}
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

      {/* STATISTICS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card-label">
            Total Users
          </span>

          <strong className="stat-card-value">
            {users.length}
          </strong>

          <p>Registered system users</p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Active Users
          </span>

          <strong className="stat-card-value">
            {activeUsers}
          </strong>

          <p>Users with active access</p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Inactive Users
          </span>

          <strong className="stat-card-value">
            {inactiveUsers}
          </strong>

          <p>Users without active access</p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Facilities
          </span>

          <strong className="stat-card-value">
            {facilities.length}
          </strong>

          <p>Available health facilities</p>
        </div>
      </div>

      {/* CREATE USER */}
      {showForm && (
        <section
          className="card"
          style={{ marginBottom: "24px" }}
        >
          <div className="page-header">
            <div>
              <h2>Create System User</h2>

              <p>
                Create an account and assign the
                appropriate access role.
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
                <label htmlFor="user-name">
                  Full Name
                </label>

                <input
                  id="user-name"
                  className="form-control"
                  type="text"
                  placeholder="Enter full name"
                  value={form.name}
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
                <label htmlFor="user-email">
                  Email
                </label>

                <input
                  id="user-email"
                  className="form-control"
                  type="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-password">
                  Password
                </label>

                <input
                  id="user-password"
                  className="form-control"
                  type="password"
                  placeholder="Create password"
                  value={form.password}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      password:
                        event.target.value,
                    })
                  }
                  minLength={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-role">
                  Role
                </label>

                <select
                  id="user-role"
                  className="form-control"
                  value={form.role}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      role: event.target.value,
                    })
                  }
                  required
                >
                  <option value="">
                    Select role
                  </option>

                  {roles.map((role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="form-group"
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                <label htmlFor="user-facility">
                  Health Facility
                </label>

                <select
                  id="user-facility"
                  className="form-control"
                  value={form.facility}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      facility:
                        event.target.value,
                    })
                  }
                  required
                >
                  <option value="">
                    Select health facility
                  </option>

                  {facilities.map((facility) => (
                    <option
                      key={facility._id}
                      value={facility._id}
                    >
                      {facility.name}
                    </option>
                  ))}
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
                  ? "Creating..."
                  : "Create User"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* USER DIRECTORY */}
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
              System Users
            </h2>

            <p
              style={{
                margin: 0,
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Showing {filteredUsers.length} of{" "}
              {users.length} users
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
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              className="form-control"
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value
                )
              }
            >
              <option value="">
                All roles
              </option>

              {roles.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>

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

        {filteredUsers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              color: "#667085",
            }}
          >
            <h3>No users found</h3>

            <p>
              {search ||
              roleFilter ||
              statusFilter
                ? "Try changing your search or filters."
                : "No system users have been created yet."}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Facility</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const role = getRoleName(
                    user.role
                  );

                  return (
                    <tr key={user._id}>
                      <td>
                        <strong>
                          {user.name}
                        </strong>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span className="role-badge">
                          {role}
                        </span>
                      </td>

                      <td>
                        {getFacilityName(
                          user.facility
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            user.isActive
                              ? "status-success"
                              : "status-inactive"
                          }`}
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
};

export default UsersPage;