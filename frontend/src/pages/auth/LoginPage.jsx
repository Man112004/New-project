import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { data } = await authApi.login(form);
      login(data);
      navigate(data.role === "CITIZEN" ? "/my-complaints" : "/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <section className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="error-text">{error}</p>}
        <button className="primary-btn" type="submit">Secure Login</button>
      </form>
    </section>
  );
}
