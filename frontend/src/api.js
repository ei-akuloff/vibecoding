const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;
    try {
      const payload = await response.json();
      if (payload?.detail) {
        detail =
          typeof payload.detail === "string"
            ? payload.detail
            : JSON.stringify(payload.detail);
      }
    } catch {
      // Keep fallback message when body is not JSON.
    }
    throw new Error(detail);
  }

  return response.json();
}

export function getSubscriptions() {
  return request("/subscriptions", { method: "GET" });
}

export function createSubscription(data) {
  return request("/subscriptions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateSubscriptionStatus(id, status) {
  return request(`/subscriptions/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getMetrics() {
  return request("/metrics", { method: "GET" });
}
