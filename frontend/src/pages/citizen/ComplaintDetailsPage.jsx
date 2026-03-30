import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminApi, complaintApi, departmentApi } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/common/StatusBadge";

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const { auth } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [adminForm, setAdminForm] = useState({ status: "IN_PROGRESS", comment: "", departmentId: "", priority: "MEDIUM", solvedImageUrl: "" });

  useEffect(() => {
    const loader = auth.role === "CITIZEN" ? complaintApi.getById(id) : adminApi.getComplaint(id);
    loader.then(({ data }) => setComplaint(data));
  }, [id, auth.role]);

  useEffect(() => {
    if (!complaint || auth.role === "CITIZEN") return;
    departmentApi.list(complaint.city).then(({ data }) => setDepartments(data));
  }, [complaint, auth.role]);

  async function handleReopen() {
    const { data } = await complaintApi.reopen(id);
    setComplaint(data);
  }

  async function handleRate(rating) {
    const { data } = await complaintApi.rate(id, { rating });
    setComplaint(data);
  }

  async function handleAdminUpdate(event) {
    event.preventDefault();
    const { data } = await adminApi.updateComplaint(id, {
      ...adminForm,
      departmentId: adminForm.departmentId ? Number(adminForm.departmentId) : null
    });
    setComplaint(data);
  }

  if (!complaint) return <p>Loading complaint...</p>;

  return (
    <section className="section-stack">
      <div className="card">
        <div className="detail-head">
          <div>
            <h2>{complaint.title}</h2>
            <p>{complaint.description}</p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
        <div className="detail-grid">
          <p><strong>Category:</strong> {complaint.category.replaceAll("_", " ")}</p>
          <p><strong>Priority:</strong> {complaint.priority}</p>
          <p><strong>Location:</strong> {complaint.address}</p>
          <p><strong>Department:</strong> {complaint.departmentName || "Not assigned"}</p>
        </div>
        {complaint.imageUrl && <img className="media-preview" src={`${import.meta.env.VITE_FILE_BASE_URL || "http://localhost:8080"}${complaint.imageUrl}`} alt={complaint.title} />}
        {auth.role === "CITIZEN" && complaint.status === "RESOLVED" && (
          <div className="row-actions">
            <button className="ghost-btn" onClick={handleReopen}>Reopen Complaint</button>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button key={rating} className="ghost-btn" onClick={() => handleRate(rating)}>{rating} Star</button>
            ))}
          </div>
        )}
      </div>

      {auth.role !== "CITIZEN" && (
        <div className="card">
          <h3>Administrative Update</h3>
          <form className="form-grid" onSubmit={handleAdminUpdate}>
            <select value={adminForm.status} onChange={(e) => setAdminForm({ ...adminForm, status: e.target.value })}>
              {["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REOPENED"].map((status) => <option key={status}>{status}</option>)}
            </select>
            <select value={adminForm.priority} onChange={(e) => setAdminForm({ ...adminForm, priority: e.target.value })}>
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((priority) => <option key={priority}>{priority}</option>)}
            </select>
            <select value={adminForm.departmentId} onChange={(e) => setAdminForm({ ...adminForm, departmentId: e.target.value })}>
              <option value="">Assign department</option>
              {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
            </select>
            <input placeholder="Solved image URL" value={adminForm.solvedImageUrl} onChange={(e) => setAdminForm({ ...adminForm, solvedImageUrl: e.target.value })} />
            <textarea placeholder="Add update comment" rows="4" value={adminForm.comment} onChange={(e) => setAdminForm({ ...adminForm, comment: e.target.value })} />
            <button className="primary-btn" type="submit">Save Update</button>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Timeline</h3>
        <div className="list-stack">
          {complaint.updates.map((item) => (
            <div key={item.id} className="timeline-item">
              <strong>{item.status}</strong>
              <p>{item.comment}</p>
              <span>{item.updatedBy} • {new Date(item.updatedAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
