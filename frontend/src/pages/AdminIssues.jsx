import { useEffect, useState } from "react";

function AdminIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/issues",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();

      setIssues(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleResolve = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/issues/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Issue marked as resolved!");

        setIssues((currentIssues) =>
          currentIssues.map((item) =>
            item._id === id ? data : item
          )
        );
      } else {
        alert("Failed to resolve issue.");
      }
    } catch (error) {
      console.error("Error resolving issue:", error);
      alert("Server error. Please try again.");
    }
  };

  if (loading) {
    return <div className="page">Loading issues...</div>;
  }

  return (
    <div className="page">
      <h1>Reported Issues</h1>

      <p>
        Review water-related issues reported by residents.
      </p>

      {issues.length === 0 ? (
        <div className="card">
          <h2>No Reported Issues</h2>

          <p>
            There are currently no issues reported by residents.
          </p>
        </div>
      ) : (
        issues.map((item) => (
          <div className="card" key={item._id}>
            <h2>{item.issue}</h2>

            <p>
              <strong>Locality:</strong> {item.area}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {item.description || "No description provided"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {item.status}
            </p>

            <p>
              <strong>Reported:</strong>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>

            {item.status === "Pending" && (
              <button
                onClick={() => handleResolve(item._id)}
              >
                Mark as Resolved
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminIssues;

