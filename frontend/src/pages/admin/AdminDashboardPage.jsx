import { useEffect, useState } from "react";
import { adminApi, departmentApi } from "../../api/services";
import CategoryChart from "../../components/charts/CategoryChart";
import DistributionChart from "../../components/charts/DistributionChart";
import StatCard from "../../components/common/StatCard";
import AdminComplaintTable from "../../components/admin/AdminComplaintTable";

const categories = ["", "ROAD_DAMAGE", "GARBAGE", "STREET_LIGHT", "WATER_LEAKAGE", "DRAINAGE", "TRAFFIC_SIGNAL", "ANIMAL_NUISANCE", "TREE_FALLEN", "OTHER_CIVIC_ISSUES"];

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [filters, setFilters] = useState({ city: "", ward: "", area: "", category: "", status: "" });

  async function loadDashboard() {
    const [dashboardRes, complaintsRes, departmentsRes, officersRes] = await Promise.all([
      adminApi.dashboard(),
      adminApi.complaints(filters),
      departmentApi.list(filters.city),
      adminApi.officers(filters.city)
    ]);
    setSummary(dashboardRes.data);
    setComplaints(complaintsRes.data);
    setDepartments(departmentsRes.data);
    setOfficers(officersRes.data);
  }

  useEffect(() => {
    loadDashboard();
  }, [filters.city, filters.ward, filters.area, filters.category, filters.status]);

  async function handleQuickUpdate(id, payload) {
    await adminApi.updateComplaintStatus(id, payload);
    await loadDashboard();
  }

  async function handleDeleteComplaint(id) {
    await adminApi.deleteComplaint(id);
    await loadDashboard();
  }

  return (
    <section className="section-stack">
      {summary && (
        <div className="stats-grid">
          <StatCard label="Total Complaints" value={summary.totalComplaints} hint="All active and historic records" />
          <StatCard label="Pending" value={summary.pendingComplaints} hint="Needs review or assignment" />
          <StatCard label="Resolved" value={summary.resolvedComplaints} hint="Completed civic responses" />
          <StatCard label="In Progress" value={summary.inProgressComplaints} hint="Departments and officers working" />
        </div>
      )}

      <div className="admin-header-block">
        <h2>Analytics Dashboard</h2>
        <p>City-wide insights and performance metrics.</p>
      </div>

      <div className="card admin-filter-card">
        <div className="admin-filter-grid">
          <input placeholder="Filter by city" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} />
          <input placeholder="Filter by ward" value={filters.ward} onChange={(e) => setFilters({ ...filters, ward: e.target.value })} />
          <input placeholder="Filter by area" value={filters.area} onChange={(e) => setFilters({ ...filters, area: e.target.value })} />
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            {categories.map((item) => (
              <option key={item} value={item}>{item ? item.replaceAll("_", " ") : "All categories"}</option>
            ))}
          </select>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All statuses</option>
            {["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "REOPENED"].map((item) => (
              <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
            ))}
          </select>
        </div>
      </div>

      {summary && (
        <div className="admin-chart-grid">
          <CategoryChart data={summary.byCategory} />
          <DistributionChart title="City Statistics" data={summary.byCity} />
          <DistributionChart title="Ward Statistics" data={summary.byWard} />
        </div>
      )}

      {summary && (
        <div className="card">
          <h3>Recent Complaints</h3>
          <div className="recent-grid">
            {summary.recentComplaints.map((complaint) => (
              <div key={complaint.id} className="info-card compact-card">
                <strong>#{complaint.id} {complaint.title}</strong>
                <span>{complaint.citizenName}</span>
                <small>{complaint.city} | {complaint.category.replaceAll("_", " ")}</small>
              </div>
            ))}
          </div>
        </div>
      )}

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
