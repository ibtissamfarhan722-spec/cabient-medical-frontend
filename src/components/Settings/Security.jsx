import React, { useState } from "react";
import { Globe, Shield, Eye, EyeOff } from "lucide-react";

const Security = () => {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strongPass, setStrongPass] = useState(false);

  function hundlerStrongPass(e) {
    const value = e.target.value || "";

    const lengthRule = value.length >= 8;
    const upperRule = /[A-Z]/.test(value);
    const lowerRule = /[a-z]/.test(value);
    const numberRule = /[0-9]/.test(value);
    const specialRule = /[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?~`]/.test(value);

    const isStrong =
      lengthRule && upperRule && lowerRule && numberRule && specialRule;

    setStrongPass(isStrong);
  }

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>
          <Shield size={22} /> Password & Security
        </h2>
        <p>Update your password and enhance your account security</p>
      </div>

      <div className="security-settings">
        <div className="form-group">
          <label htmlFor="currentPassword" className="form-label">
            Current Password
            <button
              type="button"
              className="password-toggle "
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>
          <input
            className="input"
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            placeholder="Enter current password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="form-label">
            New Password
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>
          <input
            className={`input ${strongPass ? "input-success" : "input-error"}`}
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            placeholder="Enter new password"
            onChange={hundlerStrongPass}
          />
          <div className="password-strength">
            <div
              className={`strength-bar ${strongPass ? "strong" : "weak"}`}
            ></div>
            <span>Password strength: {strongPass ? "Strong" : "Weak"}</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>
          <input
            className="input"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm new password"
          />
        </div>

        <div className="security-features">
          <h3>Security Features</h3>

          <div className="toggle-group">
            <div className="toggle-item">
              <div>
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <h4>Login Notifications</h4>
                <p>Get notified when someone logs into your account</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="toggle-item">
              <div>
                <h4>Session Timeout</h4>
                <p>Automatically log out after 30 minutes of inactivity</p>
              </div>
              <label className="toggle-switch">
                <input  type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="security-sessions">
          <h3>Active Sessions</h3>
          <div className="sessions-list">
            <div className="session-item">
              <div className="session-info">
                <div className="session-icon">
                  <Globe size={20} />
                </div>
                <div>
                  <h4>Chrome on Windows</h4>
                  <p>New York, USA • Current session</p>
                </div>
              </div>
              <button className="btn-ghost">Log Out</button>
            </div>
            <div className="session-item">
              <div className="session-info">
                <div className="session-icon">
                  <Globe size={20} />
                </div>
                <div>
                  <h4>Safari on iPhone</h4>
                  <p>San Francisco, USA • 2 hours ago</p>
                </div>
              </div>
              <button className="btn-ghost">Log Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
