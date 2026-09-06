import { useEffect, useState } from "react";

function PlatformAdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [addingCity, setAddingCity] = useState(false);
  const [deactivating, setDeactivating] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: ""
  });

  const [cityName, setCityName] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/admin-management/admins",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch admins"
        );
      }

      setAdmins(data);
    } catch (error) {
      console.error("Fetch admins error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/cities"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch cities"
        );
      }

      setCities(data);
    } catch (error) {
      console.error("Fetch cities error:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchCities();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleCreateAdmin = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setCreating(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/admin-management/admins",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create admin"
        );
      }

      setMessage("Admin created successfully.");

      setFormData({
        name: "",
        email: "",
        password: "",
        city: ""
      });

      fetchAdmins();
    } catch (error) {
      console.error("Create admin error:", error);
      setError(error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleAddCity = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setAddingCity(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/cities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: cityName
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add city"
        );
      }

      setMessage("City added successfully.");
      setCityName("");

      fetchCities();
    } catch (error) {
      console.error("Add city error:", error);
      setError(error.message);
    } finally {
      setAddingCity(false);
    }
  };

  const handleDeactivateAdmin = async (adminId) => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate this admin?"
    );

    if (!confirmDeactivate) {
      return;
    }

    setMessage("");
    setError("");
    setDeactivating(adminId);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin-management/admins/${adminId}/deactivate`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to deactivate admin"
        );
      }

      setMessage("Admin deactivated successfully.");

      fetchAdmins();
    } catch (error) {
      console.error("Deactivate admin error:", error);
      setError(error.message);
    } finally {
      setDeactivating(null);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading platform dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Platform Admin Dashboard</h1>

      <p>
        Manage PaniTime cities and city administrators.
      </p>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <hr />

      {/* City Management */}

      <h2>City Management</h2>

      <p>
        Add cities that can be used on the PaniTime platform.
      </p>

      <form onSubmit={handleAddCity}>
        <input
          type="text"
          value={cityName}
          onChange={(event) =>
            setCityName(event.target.value)
          }
          placeholder="Enter city name"
          required
        />

        <button
          type="submit"
          disabled={addingCity}
        >
          {addingCity ? "Adding..." : "Add City"}
        </button>
      </form>

      <h3>Available Cities</h3>

      {cities.length === 0 ? (
        <p>No cities found.</p>
      ) : (
        <ul>
          {cities.map((city) => (
            <li key={city._id}>
              {city.name}
            </li>
          ))}
        </ul>
      )}

      <hr />

      {/* Create Admin */}

      <h2>Create City Admin</h2>

      <p>
        Create an administrator account for a specific city.
      </p>

      <form onSubmit={handleCreateAdmin}>

        <div className="form-group">
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter admin name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter admin email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="form-group">
          <label>City</label>

          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">
              Select a city
            </option>

            {cities.map((city) => (
              <option
                key={city._id}
                value={city.name}
              >
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={creating}
        >
          {creating
            ? "Creating..."
            : "Create Admin"}
        </button>

      </form>

      <hr />

      {/* Admin List */}

      <h2>City Administrators</h2>

      {admins.length === 0 ? (
        <p>No city admins found.</p>
      ) : (
        <div>
          {admins.map((admin) => (
            <div className="card" key={admin._id}>

              <h3>{admin.name}</h3>

              <p>
                <strong>Email:</strong>{" "}
                {admin.email}
              </p>

              <p>
                <strong>City:</strong>{" "}
                {admin.city}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {admin.isActive
                  ? "Active"
                  : "Inactive"}
              </p>

              {admin.isActive && (
                <button
                  onClick={() =>
                    handleDeactivateAdmin(
                      admin._id
                    )
                  }
                  disabled={
                    deactivating === admin._id
                  }
                >
                  {deactivating === admin._id
                    ? "Deactivating..."
                    : "Deactivate Admin"}
                </button>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlatformAdminDashboard;
