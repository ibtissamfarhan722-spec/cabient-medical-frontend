import React, { useState } from "react";
import { Palette, Check, Globe, Moon, Sun } from "lucide-react";

const Appearance = () => {
  const [selectedTheme, setSelectedTheme] = useState("light");

  const themes = [
    { id: "light", name: "Light", icon: <Sun size={20} /> },
    { id: "dark", name: "Dark", icon: <Moon size={20} /> },
    { id: "auto", name: "Auto", icon: <Globe size={20} /> },
  ];

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>
          <Palette size={22} /> Appearance & Theme
        </h2>
        <p>Customize how the dashboard looks and feels</p>
      </div>

      <div className="appearance-settings">
        <div className="theme-selection">
          <h3>Theme</h3>
          <div className="theme-options">
            {themes.map((theme) => (
              <label
                key={theme.id}
                className={`theme-option ${
                  selectedTheme === theme.id ? "selected" : ""
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <div className="theme-icon">{theme.icon}</div>
                <input
                  type="radio"
                  name="theme"
                  value={theme.id}
                  checked={selectedTheme === theme.id}
                  onChange={() => {}}
                />
                <div className="theme-name">{theme.name}</div>
              </label>
            ))}
          </div>
        </div>

        <div className="color-scheme">
          <h3>Accent Color</h3>
          <div className="color-options">
            {[
              { color: "#D4AF37", name: "Gold" },
              { color: "#3B82F6", name: "Blue" },
              { color: "#10B981", name: "Green" },
              { color: "#8B5CF6", name: "Purple" },
              { color: "#EF4444", name: "Red" },
              { color: "#F59E0B", name: "Amber" },
            ].map((scheme) => (
              <label key={scheme.color} className="color-option">
                <div
                  className="color-preview"
                  style={{ backgroundColor: scheme.color }}
                >
                  {scheme.color === "#D4AF37" && <Check size={16} />}
                </div>
                <input
                  type="radio"
                  name="color"
                  defaultChecked={scheme.color === "#D4AF37"}
                />
                <span className="color-name">{scheme.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="layout-settings">
          <h3>Layout Settings</h3>
          <div className="layout-options">
            <div className="toggle-item">
              <div>
                <h4>Compact Mode</h4>
                <p>Reduce spacing for more content on screen</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <h4>Show Sidebar Labels</h4>
                <p>Display text labels in the sidebar</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <h4>Animated Transitions</h4>
                <p>Enable smooth animations throughout the app</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="preview-section">
          <h3>Preview</h3>

          <div className="theme-preview">
            <div className="preview-header"></div>
            <div className="preview-sidebar">
              <div className="menu-item">
                <div className="menu-icon"></div>
                <div className="menu-text"></div>
              </div>
              <div className="menu-item">
                <div className="menu-icon"></div>
                <div className="menu-text"></div>
              </div>
              <div className="menu-item">
                <div className="menu-icon"></div>
                <div className="menu-text"></div>
              </div>
            </div>
            <div className="preview-content">
              <div className="preview-card"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearance;
