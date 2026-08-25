import React from "react";

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
            <path d="M6 15h4" />
            <path d="M14 15h4" />
          </svg>
        </div>
        <div className="header-text">
          <h1>Subscription Tracker</h1>
          <p>Monitor recurring SaaS &amp; streaming costs, renewal dates, and monthly cash-flow burn.</p>
        </div>
      </div>
    </header>
  );
}

export default Header;