import { useEffect, useState } from "react";
import { adminApi, departmentApi } from "../../api/services";
import AdminComplaintTable from "../../components/admin/AdminComplaintTable";

const categories = ["", "ROAD_DAMAGE", "GARBAGE", "STREET_LIGHT", "WATER_LEAKAGE", "DRAINAGE", "TRAFFIC_SIGNAL", "ANIMAL_NUISANCE", "TREE_FALLEN", "OTHER_CIVIC_ISSUES"];
const statuses = ["", "PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REOPENED"];

export default function AdminComplaintsPage() {
  const [filters, setFilters] = useState({ city: "", ward: "", area: "", category: "", status: "" });
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);

  async function loadComplaintsPage() {
    const [complaintsRes, departmentsRes, officersRes] = await Promise.all([
      adminApi.complaints(filters),
      departmentApi.list(filters.city),
      adminApi.officers(filters.city)
    ]);
    setComplaints(complaintsRes.data);
    setDepartments(departmentsRes.data);
    setOfficers(officersRes.data);
  }

  useEffect(() => {
    loadComplaintsPage();
  }, [filters.city, filters.ward, filters.area, filters.category, filters.status]);

  async function handleQuickUpdate(id, payload) {
    await adminApi.updateComplaintStatus(id, payload);
    await loadComplaintsPage();
  }

  async function handleDeleteComplaint(id) {
    await adminApi.deleteComplaint(id);
    await loadComplaintsPage();
  }

  return (
    <section className="section-stack">
      <div className="admin-header-block">
        <h2>All Complaints</h2>
        <p>Manage and track all civic issues across the city.</p>
      </div>

      <div className="card admin-filter-card">
        <div className="admin-toolbar-grid">
          <input placeholder="Search by city" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <input placeholder="Ward" value={filters.ward} onChange={(e) => setFilters({ ...filters, ward: e.target.value })} />
          <input placeholder="Area" value={filters.area} onChange={(e) => setFilters({ ...filters, area: e.target.value })} />
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            {categories.map((item) => (
              <option key={item} value={item}>{item ? item.replaceAll("_", " ") : "All Categories"}</option>
            ))}
          </select>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            {statuses.map((item) => (
              <option key={item} value={item}>{item ? item.replaceAll("_", " ") : "All Status"}</option>
            ))}
          </select>
        </div>
      </div>

      <AdminComplaintTable
        complaints={complaints}
        departments={departments}
        officers={officers}
        onQuickUpdate={handleQuickUpdate}
        onDeleteComplaint={handleDeleteComplaint}
      />
    </section>
  );
}
