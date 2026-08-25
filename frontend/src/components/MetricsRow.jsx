import React from "react";

function MetricsRow({ metrics }) {
  const monthlyBurn = Number(metrics?.total_monthly_burn || 0);
  const alerts = Number(metrics?.upcoming_renewals_alert_count || 0);

  return (
    <section className="metrics-row">
      <article className="metric-card">
        <h2>Total Monthly Burn Rate</h2>
        <p className="metric-value">Rs {monthlyBurn.toFixed(2)}</p>
      </article>
      <article className="metric-card">
        <h2>Upcoming Renewals Alert Count</h2>
        <p className="metric-value">{alerts}</p>
      </article>
    </section>
  );
}

export default MetricsRow;
