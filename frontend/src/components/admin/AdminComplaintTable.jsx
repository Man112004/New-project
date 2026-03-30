import { useEffect, useMemo, useState } from "react";
import MediaPreviewCell from "../common/MediaPreviewCell";
import StatusBadge from "../common/StatusBadge";

const statusOptions = ["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REOPENED"];
const priorityOptions = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function AdminComplaintTable({
  complaints,
  departments,
  officers,
  onQuickUpdate,
  onDeleteComplaint
}) {
  const fileBaseUrl = import.meta.env.VITE_FILE_BASE_URL || "http://localhost:8080";
  const initialState = useMemo(
    () =>
      Object.fromEntries(
        complaints.map((complaint) => [
          complaint.id,
          {
            status: complaint.status,
            priority: complaint.priority,
            departmentId: complaint.departmentId || "",
            officerId: complaint.assignedOfficerId || "",
            comment: "",
            solvedImageUrl: complaint.solvedImageUrl || ""
          }
        ])
      ),
    [complaints]
  );
  const [drafts, setDrafts] = useState(initialState);

  useEffect(() => {
    setDrafts(initialState);
  }, [initialState]);

  function updateDraft(id, key, value) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        [key]: value
      }
    }));
  }

  return (
    <div className="admin-table-card">
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>User Name</th>
              <th>Category</th>
              <th>Media</th>
              <th>Location</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Department</th>
              <th>Officer</th>
              <th>Created</th>
              <th>Admin Comment</th>
              <th>Solved Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => {
              const draft = drafts[complaint.id] || {};
              return (
                <tr key={complaint.id}>
                  <td>#{complaint.id}</td>
                  <td>{complaint.citizenName}</td>
                  <td>{complaint.category.replaceAll("_", " ")}</td>
                  <td>
                    <MediaPreviewCell
                      imageUrl={complaint.imageUrl}
                      videoUrl={complaint.videoUrl}
                      fileBaseUrl={fileBaseUrl}
                    />
                  </td>
                  <td>
                    <a
                      className="ghost-btn table-action-btn"
                      href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open Map
                    </a>
                  </td>
                  <td>
                    <select value={draft.status || complaint.status} onChange={(e) => updateDraft(complaint.id, "status", e.target.value)}>
                      {statusOptions.map((status) => <option key={status}>{status}</option>)}
                    </select>
                    <StatusBadge status={draft.status || complaint.status} />
                  </td>
                  <td>
                    <select value={draft.priority || complaint.priority} onChange={(e) => updateDraft(complaint.id, "priority", e.target.value)}>
                      {priorityOptions.map((priority) => <option key={priority}>{priority}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={draft.departmentId || ""} onChange={(e) => updateDraft(complaint.id, "departmentId", e.target.value)}>
                      <option value="">Assign department</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>{department.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={draft.officerId || ""} onChange={(e) => updateDraft(complaint.id, "officerId", e.target.value)}>
                      <option value="">Assign officer</option>
                      {officers.map((officer) => (
                        <option key={officer.id} value={officer.id}>{officer.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                  <td>
                    <textarea
                      rows="3"
                      placeholder="Add admin comment"
                      value={draft.comment || ""}
                      onChange={(e) => updateDraft(complaint.id, "comment", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Solved image URL"
                      value={draft.solvedImageUrl || ""}
                      onChange={(e) => updateDraft(complaint.id, "solvedImageUrl", e.target.value)}
                    />
                  </td>
                  <td>
                    <div className="table-action-stack">
                      <button
                        className="primary-btn table-action-btn"
                        onClick={() =>
                          onQuickUpdate(complaint.id, {
                            status: draft.status || complaint.status,
                            priority: draft.priority || complaint.priority,
                            departmentId: draft.departmentId ? Number(draft.departmentId) : null,
                            officerId: draft.officerId ? Number(draft.officerId) : null,
                            comment: draft.comment || "Status updated by admin",
                            solvedImageUrl: draft.solvedImageUrl || ""
                          })
                        }
                      >
                        Save
                      </button>
                      <button
                        className="ghost-btn table-action-btn"
                        onClick={() =>
                          onQuickUpdate(complaint.id, {
                            status: "RESOLVED",
                            priority: draft.priority || complaint.priority,
                            departmentId: draft.departmentId ? Number(draft.departmentId) : null,
                            officerId: draft.officerId ? Number(draft.officerId) : null,
                            comment: draft.comment || "Complaint resolved by administration",
                            solvedImageUrl: draft.solvedImageUrl || ""
                          })
                        }
                      >
                        Mark Resolved
                      </button>
                      <button className="ghost-btn table-action-btn danger-btn" onClick={() => onDeleteComplaint(complaint.id)}>
                        Delete Spam
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
