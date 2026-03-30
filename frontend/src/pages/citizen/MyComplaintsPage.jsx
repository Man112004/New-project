import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { complaintApi } from "../../api/services";
import StatusBadge from "../../components/common/StatusBadge";

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    complaintApi.mine().then(({ data }) => setComplaints(data));
  }, []);

  return (
    <section className="section-stack">
      <div className="section-header">
        <h2>My Complaints</h2>
      </div>
      <div className="list-stack">
        {complaints.map((complaint) => (
          <article key={complaint.id} className="list-item">
            <div>
              <strong>{complaint.title}</strong>
              <p>{complaint.category.replaceAll("_", " ")}</p>
              <small>{complaint.address}</small>
            </div>
            <div className="row-actions">
              <StatusBadge status={complaint.status} />
              <Link className="ghost-btn" to={`/complaints/${complaint.id}`}>Details</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
