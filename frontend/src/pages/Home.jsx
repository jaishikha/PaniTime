import { Link } from "react-router-dom";

function Home() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="home">
      <h1>PaniTime</h1>

      {!user && (
        <>
          <p>Know when water is coming to your locality.</p>

          <div className="home-buttons">
            <Link to="/login">
              <button>Login</button>
            </Link>

            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
        </>
      )}

      {user && user.role === "resident" && (
        <>
          <h2>Welcome, {user.name}! 👋</h2>

          <p>
            Stay updated with water supply information
            and report water-related issues in {user.city}.
          </p>

          <div className="home-buttons">
            <Link to="/water-status">
              <button>💧 Check Water Status</button>
            </Link>

            <Link to="/report-issue">
              <button>🚨 Report an Issue</button>
            </Link>
          </div>
        </>
      )}

      {user && user.role === "admin" && (
        <>
          <h2>Welcome, {user.name}! 👋</h2>

          <p>
            Manage water supply information and view
            issues reported by residents in {user.city}.
          </p>

          <div className="home-buttons">
            <Link to="/admin">
              <button>⚙️ Admin Dashboard</button>
            </Link>

            <Link to="/admin/issues">
              <button>🚨 View Reported Issues</button>
            </Link>
          </div>
        </>
      )}

      {user && user.role === "platformAdmin" && (
        <>
          <h2>Welcome, {user.name}! 👋</h2>

          <p>
            Manage PaniTime cities and city administrators
            from the platform dashboard.
          </p>

          <div className="home-buttons">
            <Link to="/platform-admin">
              <button>⚙️ Platform Admin Dashboard</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;