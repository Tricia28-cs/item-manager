import { useUser } from "../context/UserProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [profile, setProfile] = useState(null);

  async function fetchProfile() {
    const res = await fetch(`${API_URL}/api/user/profile`, {
      credentials: "include",
    });

    if (res.status === 401) {
      navigate("/login");
      return;
    }

    const data = await res.json();
    setProfile(data);
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Profile</h2>

      {profile.profileImage && (
        <img
          src={`${API_URL}${profile.profileImage}`}
          width="160"
          style={{ borderRadius: 10 }}
        />
      )}

      <p><b>ID:</b> {profile.id}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>First name:</b> {profile.firstname}</p>
      <p><b>Last name:</b> {profile.lastname}</p>
    </div>
  );
}