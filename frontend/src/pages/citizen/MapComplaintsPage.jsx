import { useEffect, useState } from "react";
import { adminApi, complaintApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import MapPanel from "../../components/common/MapPanel";

export default function MapComplaintsPage() {
  const { auth } = useAuth();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const loader = auth.role === "CITIZEN" ? complaintApi.mine() : adminApi.complaints({});
    loader.then(({ data }) => setComplaints(data));
  }, [auth.role]);

  return (
    <section className="section-stack">
      <div className="card">
        <h2>Complaint Map View</h2>
        <p>Visualize public issues across locations using marker-based GIS-friendly layout.</p>
      </div>
      <MapPanel complaints={complaints} />
    </section>
  );
}
