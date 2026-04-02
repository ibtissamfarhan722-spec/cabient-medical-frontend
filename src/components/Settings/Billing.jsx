import React, { useState } from 'react';
import { 
  CreditCard,
  Trash2,
  Download,
  Check
} from 'lucide-react';

const Billing = () => {

  const billingPlans = [
    {
      name: 'Basic',
      price: '$0',
      period: '/month',
      features: ['Up to 10 projects', 'Basic analytics', 'Email support', '5GB storage'],
      current: true
    },
    {
      name: 'Pro',
      price: '$79',
      period: '/month',
      features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '50GB storage', 'Team collaboration'],
      current: false,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      features: ['Everything in Pro', 'Custom integrations', 'Dedicated account manager', 'Unlimited storage', 'SLA guarantee'],
      current: false
    }
  ];


  const handleExportData = () => {
    alert('Data export initiated!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested!');
    }
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>
          <CreditCard size={22} /> Billing & Subscription
        </h2>
        <p>Manage your subscription and billing information</p>
      </div>

      <div className="billing-settings">
        <div className="current-plan">
          <h3>Current Plan</h3>
          <div className="plan-cards">
            {billingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`plan-card ${plan.current ? "current" : ""} ${
                  plan.popular ? "popular" : ""
                }`}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                <div className="plan-header">
                  <h4>{plan.name}</h4>
                  <div className="plan-price">
                    <span className="amount">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={plan.current ? "btn-secondary" : "btn-primary"}
                >
                  {plan.current ? "Current Plan" : "Upgrade"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="billing-history">
          <h3>Billing History</h3>
          <div className="history-table">
            <div className="table-header">
              <div>Date</div>
              <div>Description</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Invoice</div>
            </div>
            <div className="table-row">
              <div>Mar 15, 2024</div>
              <div>Pro Plan Subscription</div>
              <div>$79.00</div>
              <div>
                <span className="status-paid">Paid</span>
              </div>
              <div>
                <button className="btn-ghost">Download</button>
              </div>
            </div>
            <div className="table-row">
              <div>Feb 15, 2024</div>
              <div>Pro Plan Subscription</div>
              <div>$79.00</div>
              <div>
                <span className="status-paid">Paid</span>
              </div>
              <div>
                <button className="btn-ghost">Download</button>
              </div>
            </div>
            <div className="table-row">
              <div>Jan 15, 2024</div>
              <div>Pro Plan Subscription</div>
              <div>$79.00</div>
              <div>
                <span className="status-paid">Paid</span>
              </div>
              <div>
                <button className="btn-ghost">Download</button>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Payment Methods</h3>
          <div className="payment-cards">
            <div className="payment-card active">
              <div className="card-details">
                <div className="card-type">Visa</div>
                <div className="card-number">**** **** **** 4242</div>
                <div className="card-expiry">Expires 12/25</div>
              </div>
              <button className="btn-ghost">Edit</button>
            </div>
            <button className="add-payment-method">
              + Add New Payment Method
            </button>
          </div>
        </div>

        <div className="billing-actions">
          <button className="btn-secondary" onClick={handleExportData}>
            <Download size={16} />
            Export Billing Data
          </button>
          <button className="btn-ghost" onClick={handleDeleteAccount}>
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
