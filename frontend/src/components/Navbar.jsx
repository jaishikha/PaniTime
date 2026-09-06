import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!user || user.role !== "resident") {
        setUnreadCount(0);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        const data = await response.json();

        if (response.ok) {
          const unread = data.filter(
            (notification) => !notification.read
          );

          setUnreadCount(unread.length);
        }
      } catch (error) {
        console.error(
          "Error fetching notification count:",
          error
        );
      }
    };

    fetchUnreadNotifications();

    // Check for new notifications every 30 seconds
    const interval = setInterval(
      fetchUnreadNotifications,
      30000
    );

    return () => clearInterval(interval);
  }, [user?.id, user?.role]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("followedLocalities");

    navigate("/login");
  };

  return (
    <nav>
      <h2>PaniTime</h2>

      <div>
        <Link to="/">Home</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && user.role === "resident" && (
          <>
            <Link to="/water-status">
              Water Status
            </Link>

            <Link to="/report-issue">
              Report Issue
            </Link>

            <Link to="/notifications">
              🔔 Notifications
              {unreadCount > 0 && (
                <span> ({unreadCount})</span>
              )}
            </Link>

            <Link to="/change-password">
              Change Password
            </Link>
          </>
        )}

        {user && user.role === "admin" && (
          <>
            <Link to="/admin">
              Dashboard
            </Link>

            <Link to="/admin/issues">
              Reported Issues
            </Link>

            <Link to="/change-password">
              Change Password
            </Link>
          </>
        )}

        {user?.role === "platformAdmin" && (
          <>
            <Link to="/platform-admin">
              Platform Admin
            </Link>

            <Link to="/change-password">
              Change Password
            </Link>
          </>
        )}

        {user && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

