import { useState } from "react";

function ReportIssue() {
  const [locality, setLocality] = useState("");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const issueData = {
      area: locality,
      issue,
      description
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/issues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify(issueData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Issue reported successfully!");

        console.log("Saved:", data);

        setLocality("");
        setIssue("");
        setDescription("");
      } else {
        alert("Failed to report issue.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="page form-page">
      <h1>Report a Water Issue</h1>

      <p>
        Let us know if there is a problem with the water supply
        in your locality.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Locality</label>

          <input
            type="text"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            placeholder="Enter your locality"
            required
          />
        </div>

        <div className="form-group">
          <label>Issue</label>

          <select
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          >
            <option value="">Select an issue</option>
            <option value="Dirty Water">Dirty Water</option>
            <option value="Low Pressure">Low Pressure</option>
            <option value="Wrong Timing">Wrong Timing</option>
            <option value="No Water Supply">No Water Supply</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue"
            rows="5"
          />
        </div>

        <button type="submit">Report Issue</button>
      </form>
    </div>
  );
}

export default ReportIssue;

