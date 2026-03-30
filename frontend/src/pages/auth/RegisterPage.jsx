import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", city: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const { data } = await authApi.register(form);
      login(data);
      navigate("/my-complaints");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <section className="auth-card">
      <h2>Citizen Registration</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        {error && <p className="error-text">{error}</p>}
        <button className="primary-btn" type="submit">Create Account</button>
      </form>
    </section>
  );
}
