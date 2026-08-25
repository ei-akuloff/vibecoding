import React from "react";

function MetricsRow({ metrics }) {
  const monthlyBurn = Number(metrics?.total_monthly_burn || 0);
  const alerts = Number(metrics?.upcoming_renewals_alert_count || 0);

  return (
    <section className="metrics-row">
      <article className="metric-card">
        <p className="metric-label">Monthly Burn Rate</p>
        <p className="metric-title">Total Recurring Spend</p>
        <p className="metric-value">₹{monthlyBurn.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="metric-sub">Active subscriptions only · normalized to monthly</p>
      </article>
      <article className="metric-card metric-card--alert">
        <p className="metric-label">Renewals Alert</p>
        <p className="metric-title">Upcoming Renewals</p>
        <p className="metric-value">{alerts}</p>
        <p className="metric-sub">Renewing within the next 7 days</p>
      </article>
    </section>
  );
}

export default MetricsRow;