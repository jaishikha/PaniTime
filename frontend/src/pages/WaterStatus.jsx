import { useEffect, useState } from "react";

function WaterStatus() {
  const [searchArea, setSearchArea] = useState("");
  const [waterStatus, setWaterStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [following, setFollowing] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Load followed localities when the page opens
  useEffect(() => {
    const loadFollowedLocalities = async () => {
      if (!user) {
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/auth/followed-localities",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }  
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Store followed localities temporarily in browser memory
          localStorage.setItem(
            "followedLocalities",
            JSON.stringify(data.followedLocalities)
          );
        }
      } catch (error) {
        console.error("Error fetching followed localities:", error);
      }
    };

    loadFollowedLocalities();
  }, [user?.id]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchArea.trim()) {
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `http://localhost:5000/api/water-status?area=${encodeURIComponent(
          searchArea
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      const result = data[0] || null;

      setWaterStatus(result);

      // Check whether this locality is already followed
      if (result) {
        const storedFollowed =
          localStorage.getItem("followedLocalities");

        const followedLocalities = storedFollowed
          ? JSON.parse(storedFollowed)
          : [];

        const isFollowing = followedLocalities.some(
          (locality) =>
            locality.toLowerCase() === result.area.toLowerCase()
        );

        setFollowing(isFollowing);
      } else {
        setFollowing(false);
      }
    } catch (error) {
      console.error("Error fetching water status:", error);
      setWaterStatus(null);
      setFollowing(false);
    }

    setLoading(false);
  };

  const handleFollow = async () => {
    if (!user || !waterStatus) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/follow-locality",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            locality: waterStatus.area
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFollowing(true);

        localStorage.setItem(
          "followedLocalities",
          JSON.stringify(data.followedLocalities)
        );

        alert(`You are now following ${waterStatus.area}.`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Follow error:", error);
      alert("Server error. Please try again.");
    }
  };

  const handleUnfollow = async () => {
    if (!user || !waterStatus) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/unfollow-locality",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            locality: waterStatus.area
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFollowing(false);

        localStorage.setItem(
          "followedLocalities",
          JSON.stringify(data.followedLocalities)
        );

        alert(`You are no longer following ${waterStatus.area}.`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Unfollow error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="page">
      <h1>Water Status</h1>

      <p>
        Search for your locality to check the latest water
        supply information.
      </p>

      <div className="card">
        <h2>Find Your Locality</h2>

        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Locality</label>

            <input
              type="text"
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
              placeholder="e.g. Sardarpura"
            />
          </div>

          <button type="submit">🔍 Search</button>
        </form>
      </div>

      {loading && (
        <div className="card">
          <p>Searching for water supply information...</p>
        </div>
      )}

      {!loading && searched && !waterStatus && (
        <div className="card">
          <h2>No Update Available</h2>

          <p>
            No water supply information was found for{" "}
            <strong>{searchArea}</strong>.
          </p>

          <p>
            Try checking the spelling or search for another locality.
          </p>
        </div>
      )}

      {!loading && waterStatus && (
        <div className="card">
          <h2>Water Supply Update</h2>

          <p>
            <strong>Locality:</strong> {waterStatus.area}
          </p>

          <p>
            <strong>Status:</strong> {waterStatus.status}
          </p>

          <p>
            <strong>Expected Time:</strong>{" "}
            {waterStatus.startTime} - {waterStatus.endTime}
          </p>

          <p>
            <strong>Date:</strong> {waterStatus.date}
          </p>

          {!following ? (
            <button onClick={handleFollow}>
              🔔 Follow this locality
            </button>
          ) : (
            <button onClick={handleUnfollow}>
              ✓ Following this locality
            </button>
          )}
        </div>
      )}

      <div className="card">
        <h2>Information</h2>

        <p>
          Follow your locality to stay informed when new water
          supply updates are available.
        </p>
      </div>
    </div>
  );
}

export default WaterStatus;

