import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

const UpdateProfile = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setEmail(currentUser.email);
  }, []);

  function handleSumbit(e) {
    e.preventDefault();
    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (email !== currentUser.email) {
      promises.push(updateEmail(email));
    }
    if (password) {
      promises.push(updatePassword(password));
    }

    Promise.all(promises)
      .then(() => {
        history.push("/");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <h2>Update profile</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Leave blank to keep the same"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="password-confirm">Password Confirmation</label>
        <input
          type="password"
          id="password-confirm"
          placeholder="Leave blank to keep the same"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          onBlur={(e) => setPasswordConfirm(e.target.value)}
        />

        <input disabled={loading} type="submit" value="Update" />
      </form>
      <p>
        <Link to="/">Cancel</Link>
      </p>
    </div>
  );
};

export default UpdateProfile;
