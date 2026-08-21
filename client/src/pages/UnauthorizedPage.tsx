import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <section
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div>
        <h1>Access Denied</h1>

        <p>
          You do not have permission to
          access this page.
        </p>

        <Link
          to="/dashboard"
          style={{
            color: "#0f766e",
            fontWeight: 600,
          }}
        >
          Return to Dashboard
        </Link>
      </div>
    </section>
  );
};

export default UnauthorizedPage;