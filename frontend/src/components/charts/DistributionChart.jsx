import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#0c6c62", "#db8a2e", "#1f6fa4", "#8a5cf6", "#d25f4d", "#7a8b3d"];

export default function DistributionChart({ title, data }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={3}>
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="legend-grid">
        {chartData.map((item, index) => (
          <div key={item.name} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: colors[index % colors.length] }} />
            <small>{item.name.replaceAll("_", " ")}</small>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
