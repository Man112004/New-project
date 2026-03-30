import { useEffect, useState } from "react";
import { notificationApi } from "../api/services";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notificationApi.list().then(({ data }) => setNotifications(data)).catch(() => setNotifications([]));
  }, []);

  return (
    <section className="section-stack">
      <div className="card">
        <h2>{auth.name}</h2>
        <p>{auth.email}</p>
        <p>{auth.city}</p>
        <p>Role: {auth.role}</p>
      </div>
      <div className="card">
        <h3>Notifications</h3>
        <div className="list-stack">
          {notifications.map((item) => (
            <div key={item.id} className="list-item">
              <strong>{item.message}</strong>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </div>
          ))}
          {notifications.length === 0 && <p>No notifications yet.</p>}
        </div>
      </div>
    </section>
  );
}
