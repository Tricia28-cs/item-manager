import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:3000/api/user";

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    status: "ACTIVE",
  });

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const query = useMemo(() => `?page=${page}&limit=${limit}`, [page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}${query}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load users");
      }

      // Backend returns { users, page, limit, totalPages, totalItems }
      setUsers(data?.users || []);
      setTotalPages(data?.totalPages || 1);
    } catch (e) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      setError("");
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create user");
      }

      setForm({ username: "", email: "", password: "", status: "ACTIVE" });
      // Go back to page 1 to see the newly added user.
      setPage(1);
      await loadUsers();
    } catch (e2) {
      setError(e2?.message || "Unknown error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      setError("");
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete user");
      }

      await loadUsers();
    } catch (e) {
      setError(e?.message || "Unknown error");
    }
  };

  return (
    <div>
      <h1>Users</h1>

      <section className="card">
        <h2>Add New User</h2>

        <form className="grid" onSubmit={handleAdd}>
          <label>
            Username
            <input value={form.username} onChange={handleChange("username")} required />
          </label>

          <label>
            Email
            <input type="email" value={form.email} onChange={handleChange("email")} required />
          </label>

          <label>
            Password
            <input type="password" value={form.password} onChange={handleChange("password")} required />
          </label>

          <label>
            Status
            <select value={form.status} onChange={handleChange("status")}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          <button type="submit" className="btn">
            Add User
          </button>
        </form>
      </section>

      <section className="card">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2>User List</h2>
          <div className="row">
            <button className="btn" disabled={!canPrev} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>
            <div className="muted">
              Page {page} / {totalPages}
            </div>
            <button className="btn" disabled={!canNext} onClick={() => setPage((p) => p + 1)}>
              Next
            </button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="error">
            {error}
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn" onClick={loadUsers}>
                Retry
              </button>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div>No users</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="mono">{u._id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.status}</td>
                  <td>
                    <div className="row">
                      <Link className="btn" to={`/users/${u._id}`}>
                        Edit
                      </Link>
                      <button className="btn danger" onClick={() => handleDelete(u._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
