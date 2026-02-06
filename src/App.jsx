import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Items from "./pages/Items.jsx";
import ItemEdit from "./pages/ItemEdit.jsx";
import Users from "./pages/Users.jsx";
import UserEdit from "./pages/UserEdit.jsx";

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Item Manager</div>
        <nav className="nav">
          <NavLink to="/items" className={({ isActive }) => (isActive ? "link active" : "link")}>
            Items
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => (isActive ? "link active" : "link")}>
            Users
          </NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemEdit />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserEdit />} />
          <Route path="/" element={<Navigate to="/items" replace />} />
          <Route path="*" element={<Navigate to="/items" replace />} />
        </Routes>
      </main>
    </div>
  );
}