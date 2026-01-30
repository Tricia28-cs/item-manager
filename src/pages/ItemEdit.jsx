import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:3000/api/item";

export default function ItemEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    itemName: "",
    itemCategory: "Stationary",
    itemPrice: "",
    status: "ACTIVE",
  });

  async function loadItem() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error ${res.status}: ${txt}`);
      }

      const data = await res.json();

      setForm({
        itemName: data.itemName ?? "",
        itemCategory: data.itemCategory ?? "Stationary",
        itemPrice: data.itemPrice ?? "",
        status: data.status ?? "ACTIVE",
      });
    } catch (e) {
      setError(e.message || "Failed to load item");
    } finally {
      setLoading(false);
    }
  }

  async function onUpdate() {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Update failed ${res.status}: ${txt}`);
      }

      nav("/items");
    } catch (e) {
      alert(e.message || "Update failed");
    }
  }

  useEffect(() => {
    loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Edit Item</h2>
        <p style={{ color: "crimson" }}>{error}</p>
        <button onClick={() => nav("/items")}>Back</button>
        <button onClick={loadItem} style={{ marginLeft: 8 }}>Retry</button>
      </div>
    );
  }

  return (
    <div className="stack">
      <h2>Edit Item</h2>

      <section className="card">
        <div className="grid2">
          <label className="field">
            <span>Name</span>
            <input
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Category</span>
            <select
              value={form.itemCategory}
              onChange={(e) => setForm({ ...form, itemCategory: e.target.value })}
            >
              <option>Stationary</option>
              <option>Kitchenware</option>
              <option>Appliance</option>
            </select>
          </label>

          <label className="field">
            <span>Price</span>
            <input
              value={form.itemPrice}
              onChange={(e) => setForm({ ...form, itemPrice: e.target.value })}
            />
          </label>

          <label className="field">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>ACTIVE</option>
              <option>INACTIVE</option>
            </select>
          </label>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn primary" onClick={onUpdate}>Save</button>
          <button className="btn" onClick={() => nav("/items")}>Cancel</button>
        </div>
      </section>
    </div>
  );
}