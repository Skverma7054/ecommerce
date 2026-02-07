import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await api.post("/api/auth/login", form);
      localStorage.setItem("token", response.data.data.token);
      setMessage("Login successful!");
      navigate("/");
    } catch (error) {
      setMessage("Invalid credentials.");
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-sm text-slate-600">Access your account to shop.</p>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full rounded border border-slate-200"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded border border-slate-200"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
        >
          Sign in
        </button>
      </form>
      {message && <p className="mt-3 text-sm text-emerald-600">{message}</p>}
      <p className="mt-4 text-sm text-slate-600">
        New here?{" "}
        <Link to="/register" className="text-indigo-600">
          Create an account
        </Link>
      </p>
    </section>
  );
}
