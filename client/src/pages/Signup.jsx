import { useState } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
    if (!email || !password) return toast.error("Fill all fields");

    try {
      await API.post("/auth/register", { email, password });
      toast.success("Account Created! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <Toaster position="top-center" />
      <div className="container">
        <div className="form-box">
          <h2>Signup</h2>
          <div className="field">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label>Email</label>
          </div>
          <div className="field">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label>Password</label>
          </div>
          <button onClick={signup}>Signup</button>
          <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
      </div>
    </div>
  );
}