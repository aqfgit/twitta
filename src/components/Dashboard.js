import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

const Dashboard = () => {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
    setError("");
  }

  return (
    <div>
      <h2>Profile</h2>
      {error && <p>{error}</p>}
      <p>Email: </p> {currentUser && currentUser.email}
      <Link to="/update-profile">Update profile</Link>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Dashboard;
