import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    if (!email) return toast.error("Enter email");
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("Reset link sent 📩");
    } catch {
      toast.error("Error sending mail");
    }
  };

  return (
    <div className="auth-page">
      <Toaster />
      <div className="container">
        <div className="form-box">
          <h2>Forgot Password</h2>
          <div className="field">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Email</label>
          </div>
          <button onClick={submit}>Send Link</button>
          <div className="auth-links">
            <p><Link to="/">Back to Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}