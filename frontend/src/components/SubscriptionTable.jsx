import React from "react";
function SubscriptionTable({ subscriptions, onToggleStatus, togglingId }) {
  return (
    <section className="card">
      <h2>Active Subscriptions</h2>
      <div className="table-wrap">
        <table className="subscriptions-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Cost</th>
              <th>Billing Cycle</th>
              <th>Next Renewal</th>
              <th>Monthly Cost</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  No subscriptions yet.
                </td>
              </tr>
            ) : (
              subscriptions.map((subscription) => {
                const isPaused = subscription.status === "paused";
                const isToggling = togglingId === subscription.id;

                return (
                  <tr
                    key={subscription.id}
                    className={isPaused ? "row-paused" : ""}
                  >
                    <td>
                      <span className="service-name">
                        {subscription.service_name}
                      </span>
                      {subscription.renewing_soon ? (
                        <span className="renewing-badge">Renewing Soon</span>
                      ) : null}
                    </td>
                    <td>Rs {Number(subscription.cost).toFixed(2)}</td>
                    <td className="capitalize">{subscription.billing_cycle}</td>
                    <td>
                      {subscription.next_renewal_date}
                      <div className="days-text">
                        {subscription.days_until_renewal} days
                      </div>
                    </td>
                    <td>Rs {Number(subscription.monthly_cost).toFixed(2)}</td>
                    <td className="capitalize">{subscription.status}</td>
                    <td>
                      <button
                        type="button"
                        className={`toggle-btn ${isPaused ? "paused" : "active"}`}
                        onClick={() =>
                          onToggleStatus(subscription.id, subscription.status)
                        }
                        disabled={isToggling}
                      >
                        {isToggling
                          ? "Saving..."
                          : isPaused
                            ? "Set Active"
                            : "Set Paused"}
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
