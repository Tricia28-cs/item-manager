import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:3000/api/item";

export default function Items() {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [items, setItems] = useState([]);

  const nameRef = useRef();
  const catRef = useRef();
  const priceRef = useRef();
  const statusRef = useRef();

  async function loadItems(p = page) {
    try {
      const res = await fetch(`${API_BASE}?page=${p}&limit=${limit}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || p);
    } catch {
      alert("Loading items failed");
    }
  }

  async function onAdd() {
    const body = {
      itemName: nameRef.current.value,
      itemCategory: catRef.current.value,
      itemPrice: priceRef.current.value,
      status: statusRef.current.value,
    };

    // PDF reminder: stringify is required  [oai_citation:9‡Next JS - 2.pdf](sediment://file_00000000dcb471fabbd3c3ff61e7c0a9)
    const res = await fetch(API_BASE, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (res.status === 200) {
      nameRef.current.value = "";
      priceRef.current.value = "";
      statusRef.current.value = "ACTIVE";
      catRef.current.value = "Stationary";
      await loadItems(1);
    } else {
      const err = await res.json();
      alert(err.message || "Add failed");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (res.status === 200) loadItems(page);
    else alert("Delete failed");
  }

  useEffect(() => {
    loadItems(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="stack">
      <h2>Items</h2>

      <section className="card">
        <h3>Add New Item</h3>
        <div className="grid2">
          <label className="field">
            <span>Name</span>
            <input ref={nameRef} placeholder="Item name" />
          </label>

          <label className="field">
            <span>Category</span>
            <select ref={catRef} defaultValue="Stationary">
              <option>Stationary</option>
              <option>Kitchenware</option>
              <option>Appliance</option>
            </select>
          </label>

          <label className="field">
            <span>Price</span>
            <input ref={priceRef} placeholder="10.99" />
          </label>

          <label className="field">
            <span>Status</span>
            <select ref={statusRef} defaultValue="ACTIVE">
              <option>ACTIVE</option>
              <option>INACTIVE</option>
            </select>
          </label>
        </div>

        <button className="btn primary" onClick={onAdd}>
          Add Item
        </button>
      </section>

      <section className="card">
        <h3>Item List</h3>
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it._id}>
                  <td className="mono">{it._id}</td>
                  <td>{it.itemName}</td>
                  <td>{it.itemCategory}</td>
                  <td>{it.itemPrice}</td>
                  <td>{it.status}</td>
                  <td className="row">
                    <Link className="btn" to={`/items/${it._id}`}>Edit</Link>
                    <button className="btn danger" onClick={() => onDelete(it._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" className="muted">No items</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pager">
          <button className="btn" disabled={page <= 1} onClick={() => loadItems(page - 1)}>
            Prev
          </button>
          <div>
            Page <b>{page}</b> / {totalPages}
          </div>
          <button className="btn" disabled={page >= totalPages} onClick={() => loadItems(page + 1)}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
}