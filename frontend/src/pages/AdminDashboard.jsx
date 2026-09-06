import { useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const today = new Date().toISOString().split("T")[0];

  const [area, setArea] = useState("");
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("Expected");

  const handleUpdate = async (e) => {
    e.preventDefault();

    const waterData = {
      area,
      date,
      startTime,
      endTime,
      status
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/water-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(waterData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Water status updated successfully!");

        console.log("Saved:", data);

        setArea("");
        setStartTime("");
        setEndTime("");
        setStatus("Expected");
      } else {
        alert("Failed to update water status.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="page form-page">
      <h1>Admin Dashboard</h1>

      <p>
        Update water supply information for residents.
      </p>

      <div className="card">
        <h2>Update Water Supply</h2>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Locality</label>

            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter locality"
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time</label>

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Expected">Expected</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button type="submit">
            Update Water Status
          </button>
        </form>
      </div>

      <div className="actions">
        <Link to="/admin/issues">
          <button>🚨 View Reported Issues</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;

