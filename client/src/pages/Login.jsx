import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please fill all fields");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Login Successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <Toaster />
      <div className="container">
        <div className="form-box">
          <h2>Login</h2>
          <div className="field">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Email</label>
          </div>
          <div className="field">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <label>Password</label>
          </div>
          <button onClick={handleLogin}>Login</button>
          
          <div className="auth-links">
            <p><Link to="/forgot-password">Forgot Password?</Link></p>
            <p>Don’t have an account? <Link to="/signup">Signup</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}