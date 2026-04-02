import React, { useState } from 'react';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const notificationTypes = [
    { id: 'email_marketing', label: 'Marketing emails', description: 'Receive emails about new products and features' },
    { id: 'email_security', label: 'Security alerts', description: 'Receive emails about your account security' },
    { id: 'push_order', label: 'Order updates', description: 'Push notifications for order status changes' },
    { id: 'push_promo', label: 'Promotional offers', description: 'Push notifications for special offers' },
    { id: 'push_news', label: 'News updates', description: 'Weekly newsletter and updates' },
  ];


  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>
          <Bell size={22} /> Notification Preferences
        </h2>
        <p>Choose how you want to be notified about activities</p>
      </div>

      <div className="notification-settings">
        <div className="notification-header">
          <div className="notification-toggle-group">
            <div className="toggle-item">
              <h3>Email Notifications</h3>
              <label className="toggle-switch large">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <h3>Push Notifications</h3>
              <label className="toggle-switch large">
                <input
                  type="checkbox"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="notification-types">
          <h3>Notification Types</h3>
          <div className="notification-list">
            {notificationTypes.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div>
                  <h4>{notification.label}</h4>
                  <p>{notification.description}</p>
                </div>
                <div className="notification-channels">
                  <label className="channel-toggle">
                    <input
                      type="checkbox"
                      defaultChecked={emailNotifications}
                      disabled={!emailNotifications}
                    />
                    <span className="toggle-label">Email</span>
                  </label>
                  <label className="channel-toggle">
                    <input
                      type="checkbox"
                      defaultChecked={pushNotifications}
                      disabled={!pushNotifications}
                    />
                    <span className="toggle-label">Push</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="notification-frequency">
          <h3>Notification Frequency</h3>
          <div className="frequency-options">
            <label className="frequency-option">
              <input type="radio" name="frequency" defaultChecked />
              <div className="option-content">
                <h4>Real-time</h4>
                <p>Receive notifications immediately</p>
              </div>
            </label>
            <label className="frequency-option">
              <input type="radio" name="frequency" />
              <div className="option-content">
                <h4>Daily Digest</h4>
                <p>Receive a summary once per day</p>
              </div>
            </label>
            <label className="frequency-option">
              <input type="radio" name="frequency" />
              <div className="option-content">
                <h4>Weekly Summary</h4>
                <p>Receive a summary once per week</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
