import React, { useEffect, useState } from "react";

import Header from "./components/Header";
import MetricsRow from "./components/MetricsRow";
import SubscriptionForm from "./components/SubscriptionForm";
import SubscriptionTable from "./components/SubscriptionTable";
import {
  createSubscription,
  deleteSubscription,
  getMetrics,
  getSubscriptions,
  updateSubscriptionStatus,
} from "./api";

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [metrics, setMetrics] = useState({
    total_monthly_burn: 0,
    upcoming_renewals_alert_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState("");

  async function refreshData() {
    const [subscriptionsData, metricsData] = await Promise.all([
      getSubscriptions(),
      getMetrics(),
    ]);

    setSubscriptions(subscriptionsData);
    setMetrics(metricsData);
  }

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      setIsLoading(true);
      setError("");

      try {
        const [subscriptionsData, metricsData] = await Promise.all([
          getSubscriptions(),
          getMetrics(),
        ]);

        if (!mounted) return;

        setSubscriptions(subscriptionsData);
        setMetrics(metricsData);
      } catch (loadError) {
        if (!mounted) return;

        setError(loadError.message || "Failed to load dashboard data.");
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleAddSubscription(payload) {
    setIsSubmitting(true);
    setError("");

    try {
      await createSubscription(payload);
      await refreshData();
    } catch (submissionError) {
      setError(submissionError.message || "Failed to create subscription.");
      throw submissionError;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteSubscription(id, serviceName) {
    if (!window.confirm(`Delete "${serviceName}"? This cannot be undone.`)) return;

    setError("");
    try {
      await deleteSubscription(id);
      await refreshData();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete subscription.");
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    setTogglingId(id);
    setError("");

    const nextStatus = currentStatus === "active" ? "paused" : "active";

    try {
      await updateSubscriptionStatus(id, nextStatus);
      await refreshData();
    } catch (toggleError) {
      setError(toggleError.message || "Failed to update subscription status.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <main className="app-shell">
      <Header />

      <MetricsRow metrics={metrics} />

      <SubscriptionForm
        onAddSubscription={handleAddSubscription}
        isSubmitting={isSubmitting}
      />

      {error ? <p className="error-banner">{error}</p> : null}

      {isLoading ? (
        <section className="card">Loading subscriptions...</section>
      ) : (
        <SubscriptionTable
          subscriptions={subscriptions}
          onToggleStatus={handleToggleStatus}
          togglingId={togglingId}
          onDeleteSubscription={handleDeleteSubscription}
        />
      )}
    </main>
  );
}

export default App;