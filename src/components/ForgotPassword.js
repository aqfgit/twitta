import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { resetPassword, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSumbit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(email);
      setMessage("Check your inbox for a password reset link");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Password reset</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>{message}</p>
      {currentUser && currentUser.email}
      <form onSubmit={handleSumbit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => setEmail(e.target.value)}
          required
        />

        <input disabled={loading} type="submit" value="Reset password" />
      </form>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <p>Need an acocount? </p> <Link to="/signup">Signup</Link>
    </div>
  );
};

export default ForgotPassword;
