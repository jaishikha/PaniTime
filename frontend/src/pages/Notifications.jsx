import { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
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
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }

      setLoading(false);
    };

    fetchNotifications();
  }, [user?.id]);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PATCH",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications((currentNotifications) =>
          currentNotifications.map((item) =>
            item._id === id ? data : item
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Notifications</h1>

      <p>
        Stay updated about changes to your followed localities.
      </p>

      {notifications.length === 0 ? (
        <div className="card">
          <h2>No Notifications</h2>

          <p>
            You don't have any notifications yet.
          </p>
        </div>
      ) : (
        notifications.map((item) => (
          <div className="card" key={item._id}>
            <h2>🔔 Water Supply Update</h2>

            <p>
              <strong>Locality:</strong> {item.locality}
            </p>

            <p>{item.message}</p>

            <p>
              <strong>Status:</strong>{" "}
              {item.read ? "Read" : "Unread"}
            </p>

            {!item.read && (
              <button onClick={() => markAsRead(item._id)}>
                Mark as Read
              </button>
            )}

            <p>
              <strong>Received:</strong>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;

