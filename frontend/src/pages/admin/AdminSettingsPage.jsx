import { useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    grievanceWindow: "30",
    autoAssignEnabled: true,
    reopenAllowed: true,
    dashboardRefresh: "15"
  });

  return (
    <section className="section-stack">
      <div className="card">
        <h2>Settings</h2>
        <p>Operational preferences for department workflows, response windows, and dashboard behavior.</p>
        <div className="admin-two-col">
          <label className="setting-card">
            <span>Complaint reopen window in days</span>
            <input value={settings.grievanceWindow} onChange={(e) => setSettings({ ...settings, grievanceWindow: e.target.value })} />
          </label>
          <label className="setting-card">
            <span>Dashboard auto refresh in minutes</span>
            <input value={settings.dashboardRefresh} onChange={(e) => setSettings({ ...settings, dashboardRefresh: e.target.value })} />
          </label>
          <label className="setting-card toggle-card">
            <span>Enable auto department suggestions</span>
            <input type="checkbox" checked={settings.autoAssignEnabled} onChange={(e) => setSettings({ ...settings, autoAssignEnabled: e.target.checked })} />
          </label>
          <label className="setting-card toggle-card">
            <span>Allow citizen reopen after resolution</span>
            <input type="checkbox" checked={settings.reopenAllowed} onChange={(e) => setSettings({ ...settings, reopenAllowed: e.target.checked })} />
          </label>
        </div>
        <button className="primary-btn" type="button">Save Settings</button>
      </div>
    </section>
  );
}
