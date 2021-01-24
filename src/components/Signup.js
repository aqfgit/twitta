import React, {useState} from 'react'
import {useAuth} from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom";


const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { signup, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSumbit(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      history.push("/");

    } catch {
      setError('Failed to create an account')
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {currentUser && currentUser.email}
      <form onSubmit={handleSumbit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={(e) => setEmail(e.target.value)} required/>

        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={(e) => setPassword(e.target.value)} required/>

        <label htmlFor="password-confirm">Password Confirmation</label>
        <input type="password" id="password-confirm" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} onBlur={(e) => setPasswordConfirm(e.target.value)} required/>

        <input disabled={loading} type="submit" value="Create an account"/>
      </form>
      <p>Already have an account? </p> <Link to="/login">Login</Link>
    </div>
  )
}

export default Signup
