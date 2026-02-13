import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Items from "./pages/Items";
import ItemEdit from "./pages/ItemEdit";
import Users from "./pages/Users";
import UserEdit from "./pages/UserEdit";

import Login from "./components/Login";
import Profile from "./components/Profile";
import Logout from "./components/Logout";
import RequireAuth from "./middleware/RequireAuth";
import { useUser } from "./context/UserProvider";

export default function App() {
  const { user } = useUser();

  return (
    <div>
      <nav style={{ display: "flex", gap: 20, padding: 12 }}>
        <NavLink to="/items">Items</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/profile">Profile</NavLink>

        {user?.isLoggedIn ? <NavLink to="/logout">Logout</NavLink> : <NavLink to="/login">Login</NavLink>}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/items" replace />} />

        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemEdit />} />

        {/* ✅ Users edit/delete like original */}
        <Route
          path="/users"
          element={
            <RequireAuth>
              <Users />
            </RequireAuth>
          }
        />
        <Route
          path="/users/:id"
          element={
            <RequireAuth>
              <UserEdit />
            </RequireAuth>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route
          path="/logout"
          element={
            <RequireAuth>
              <Logout />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/items" replace />} />
      </Routes>
    </div>
  );
}