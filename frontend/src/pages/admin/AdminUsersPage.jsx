import { useEffect, useState } from "react";
import { adminApi, departmentApi } from "../../api/services";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [departmentForm, setDepartmentForm] = useState({ name: "", city: "" });
  const [officerForm, setOfficerForm] = useState({ name: "", email: "", phone: "", password: "", city: "", departmentId: "" });

  async function loadUsersPage() {
    const [usersRes, departmentsRes] = await Promise.all([adminApi.users(), departmentApi.list()]);
    setUsers(usersRes.data);
    setDepartments(departmentsRes.data);
  }

  useEffect(() => {
    loadUsersPage();
  }, []);

  async function createDepartment(event) {
    event.preventDefault();
    await adminApi.createDepartment(departmentForm);
    setDepartmentForm({ name: "", city: "" });
    await loadUsersPage();
  }

  async function createOfficer(event) {
    event.preventDefault();
    await adminApi.createOfficer({
      ...officerForm,
      departmentId: officerForm.departmentId ? Number(officerForm.departmentId) : null
    });
    setOfficerForm({ name: "", email: "", phone: "", password: "", city: "", departmentId: "" });
    await loadUsersPage();
  }

  return (
    <section className="section-stack">
      <div className="admin-two-col">
        <div className="card">
          <h2>Create Department</h2>
          <form className="form-grid" onSubmit={createDepartment}>
            <input placeholder="Department name" value={departmentForm.name} onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })} />
            <input placeholder="City" value={departmentForm.city} onChange={(e) => setDepartmentForm({ ...departmentForm, city: e.target.value })} />
            <button className="primary-btn" type="submit">Add Department</button>
          </form>
        </div>

        <div className="card">
          <h2>Create Officer</h2>
          <form className="form-grid" onSubmit={createOfficer}>
            <input placeholder="Officer name" value={officerForm.name} onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })} />
            <input placeholder="Email" type="email" value={officerForm.email} onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })} />
            <input placeholder="Phone" value={officerForm.phone} onChange={(e) => setOfficerForm({ ...officerForm, phone: e.target.value })} />
            <input placeholder="Temporary password" type="password" value={officerForm.password} onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })} />
            <input placeholder="City" value={officerForm.city} onChange={(e) => setOfficerForm({ ...officerForm, city: e.target.value })} />
            <select value={officerForm.departmentId} onChange={(e) => setOfficerForm({ ...officerForm, departmentId: e.target.value })}>
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>{department.name}</option>
              ))}
            </select>
            <button className="primary-btn" type="submit">Add Officer</button>
          </form>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="section-header">
          <div>
            <h3>Users and Officers</h3>
            <p>Citizen, officer, and administrator directory for governance workflow management.</p>
          </div>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>City</th>
                <th>Department</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>{user.city}</td>
                  <td>{user.departmentName || "-"}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
