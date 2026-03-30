import { useEffect, useState } from "react";
import { adminApi } from "../../api/services";
import useDownloadReport from "../../hooks/useDownloadReport";
import DistributionChart from "../../components/charts/DistributionChart";

export default function ReportsPage() {
  const { download } = useDownloadReport();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    adminApi.reports().then(({ data }) => setReports(data));
  }, []);

  return (
    <section className="section-stack">
      <div className="card">
        <h2>Reports & Analytics</h2>
        <p>Comprehensive insights into civic issues across the city.</p>
        <div className="row-actions">
          <button className="primary-btn" onClick={() => download("/admin/reports/excel", "complaints-report.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}>
            Export Excel
          </button>
          <button className="ghost-btn" onClick={() => download("/admin/reports/pdf", "complaints-report.pdf", "application/pdf")}>
            Export PDF
          </button>
        </div>
      </div>

      {reports && (
        <div className="admin-chart-grid">
          <DistributionChart title="Department Breakdown" data={reports.departmentBreakdown} />
          <DistributionChart title="Category Breakdown" data={reports.categoryBreakdown} />
        </div>
      )}
    </section>
  );
}
