import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:3000/api/user";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    status: "ACTIVE",
  });

  const loadUser = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load user");
      }

      setForm({
        username: data?.username || "",
        email: data?.email || "",
        password: "", // keep empty; only set when changing password
        status: data?.status || "ACTIVE",
      });
    } catch (e) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setError("");

      // Only include password if user typed something.
      const payload = {
        username: form.username,
        email: form.email,
        status: form.status,
      };
      if (form.password.trim()) payload.password = form.password;

      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to update user");
      }

      navigate("/users");
    } catch (e2) {
      setError(e2?.message || "Unknown error");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Edit User</h1>
        <button className="btn" onClick={() => navigate("/users")}>
          Back
        </button>
      </div>

      {error ? (
        <div className="error">
          {error}
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn" onClick={loadUser}>
              Retry
            </button>
          </div>
        </div>
      ) : null}

      <section className="card">
        <form className="grid" onSubmit={handleSave}>
          <label>
            Username
            <input value={form.username} onChange={handleChange("username")} required />
          </label>

          <label>
            Email
            <input type="email" value={form.email} onChange={handleChange("email")} required />
          </label>

          <label>
            New Password (optional)
            <input type="password" value={form.password} onChange={handleChange("password")} placeholder="Leave blank to keep current" />
          </label>

          <label>
            Status
            <select value={form.status} onChange={handleChange("status")}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          <button type="submit" className="btn">
            Save
          </button>
        </form>
      </section>
    </div>
  );
}
