import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";
import { Navigate } from "react-router-dom";

export default function Logout() {
  const [done, setDone] = useState(false);
  const { logout } = useUser();

  useEffect(() => {
    (async () => {
      await logout();
      setDone(true);
    })();
  }, []);

  if (!done) return <h3>Logging out...</h3>;
  return <Navigate to="/login" replace />;
}