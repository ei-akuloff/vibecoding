import { useState } from "react";
import React from "react";
const INITIAL_FORM = {
  service_name: "",
  cost: "",
  billing_cycle: "monthly",
  next_renewal_date: "",
};

function SubscriptionForm({ onAddSubscription, isSubmitting }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.service_name.trim()) {
      return "Service name is required.";
    }
    if (!form.cost || Number(form.cost) <= 0) {
      return "Cost must be greater than 0.";
    }
    if (!form.billing_cycle) {
      return "Billing cycle is required.";
    }
    if (!form.next_renewal_date) {
      return "Renewal date is required.";
    }
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      await onAddSubscription({
        service_name: form.service_name.trim(),
        cost: Number(form.cost),
        billing_cycle: form.billing_cycle,
        next_renewal_date: form.next_renewal_date,
      });
      setForm(INITIAL_FORM);
    } catch (submissionError) {
      setError(submissionError.message || "Failed to add subscription.");
    }
  }

  return (
    <section className="card">
      <h2>Add Subscription</h2>
      <form className="subscription-form" onSubmit={handleSubmit}>
        <label>
          Service Name
          <input
            type="text"
            name="service_name"
            value={form.service_name}
            onChange={handleChange}
            placeholder="Netflix"
          />
        </label>

        <label>
          Cost
          <input
            type="number"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="649"
          />
        </label>

        <label>
          Billing Cycle
          <select
            name="billing_cycle"
            value={form.billing_cycle}
            onChange={handleChange}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>

        <label>
          Next Renewal Date
          <input
            type="date"
            name="next_renewal_date"
            value={form.next_renewal_date}
            onChange={handleChange}
          />
        </label>

        {error ? <p className="error-message">{error}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Subscription"}
        </button>
      </form>
    </section>
  );
}

export default SubscriptionForm;
