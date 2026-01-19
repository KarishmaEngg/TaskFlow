import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Added name state
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const res = await API.post(url, payload);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userName", res.data.name);
        navigate("/dashboard");
      } else {
        alert("Registration Successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <div className={`container ${isLogin ? "" : "signup-active"}`}>
        <div className="form-box">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <form onSubmit={submit}>
            {!isLogin && (
              <div className="field">
                <input type="text" required onChange={(e) => setName(e.target.value)} />
                <label>Full Name</label>
              </div>
            )}
            <div className="field">
              <input type="email" required onChange={(e) => setEmail(e.target.value)} />
              <label>Email Address</label>
            </div>
            <div className="field">
              <input type="password" required onChange={(e) => setPassword(e.target.value)} />
              <label>Password</label>
            </div>
            <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          </form>
          <p onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer', marginTop: '15px'}}>
            {isLogin ? "New here? Register →" : "Already have an account? Login →"}
          </p>
        </div>
      </div>
    </div>
  );
}