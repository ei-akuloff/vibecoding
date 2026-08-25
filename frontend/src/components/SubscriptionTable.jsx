import React from "react";

function ToggleSwitch({ isActive, isToggling, onToggle }) {
  return (
    <button
      type="button"
      className={`toggle-switch ${isActive ? "toggle-switch--active" : "toggle-switch--paused"}`}
      onClick={onToggle}
      disabled={isToggling}
      aria-label={isActive ? "Set Paused" : "Set Active"}
      title={isActive ? "Click to pause" : "Click to activate"}
    >
      <span className="toggle-switch__track">
        <span className="toggle-switch__thumb" />
      </span>
      <span className="toggle-switch__label">
        {isToggling ? "…" : isActive ? "Active" : "Paused"}
      </span>
    </button>
  );
}

function fmt(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function SubscriptionTable({ subscriptions, onToggleStatus, togglingId, onDeleteSubscription }) {
  return (
    <section className="card">
      <div className="card-header">
        <h2>All Subscriptions</h2>
        {subscriptions.length > 0 && (
          <span className="card-count">{subscriptions.length}</span>
        )}
      </div>
      <div className="table-wrap">
        <table className="subscriptions-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Cost</th>
              <th>Cycle</th>
              <th>Next Renewal</th>
              <th>Monthly Cost</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state-cell">
                  <div className="empty-state-inner">
                    <span className="empty-state-icon">📋</span>
                    <p className="empty-state-title">No subscriptions yet</p>
                    <p className="empty-state-desc">
                      Add your recurring SaaS and streaming subscriptions above to start tracking renewals and monthly spend.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => {
                const isPaused = sub.status === "paused";
                const isToggling = togglingId === sub.id;
                const daysUrgent = sub.renewing_soon;

                return (
                  <tr key={sub.id} className={isPaused ? "row-paused" : ""}>
                    <td>
                      <div className="service-cell">
                        <span className="service-name">{sub.service_name}</span>
                        {sub.renewing_soon && (
                          <span className="renewing-badge">Renewing Soon</span>
                        )}
                      </div>
                    </td>
                    <td className="cost-primary">{fmt(sub.cost)}</td>
                    <td><span className="cycle-pill">{sub.billing_cycle}</span></td>
                    <td>
                      <span className="renewal-date">{sub.next_renewal_date}</span>
                      <div className={`days-text${daysUrgent ? " days-text--urgent" : ""}`}>
                        {sub.days_until_renewal >= 0
                          ? `in ${sub.days_until_renewal} day${sub.days_until_renewal !== 1 ? "s" : ""}`
                          : `${Math.abs(sub.days_until_renewal)} day${Math.abs(sub.days_until_renewal) !== 1 ? "s" : ""} overdue`}
                      </div>
                    </td>
                    <td className="cost-monthly">{fmt(sub.monthly_cost)}<span style={{fontSize:"0.7rem",fontWeight:400,color:"#6b7280"}}>/mo</span></td>
                    <td>
                      <ToggleSwitch
                        isActive={!isPaused}
                        isToggling={isToggling}
                        onToggle={() => onToggleStatus(sub.id, sub.status)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => onDeleteSubscription(sub.id, sub.service_name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SubscriptionTable;