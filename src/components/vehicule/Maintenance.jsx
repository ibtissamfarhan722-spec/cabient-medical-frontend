import React from "react";
import "./style/maintenance.css";

function Maintenance() {
  const maintenances = [
    {
      id: 1,
      title: "Oil Change Required",
      description: "Due at 50,000 km or by Dec 20, 2024",
      due: "Dec 20, 2024",
      type: "danger",
    },
    {
      id: 2,
      title: "Tire Rotation Due",
      description: "Recommended every 10,000 km",
      due: "Jan 15, 2025",
      type: "warning",
    },
    {
      id: 3,
      title: "Registration Renewal",
      description: "Vehicle registration expires soon",
      due: "Mar 15, 2025",
      type: "danger",
    },
  ];

  return (
    <div className="maintenance-container">
      {maintenances.map((item) => (
        <div key={item.id} className={`maintenance-card ${item.type}`}>
          <div className="maintenance-left">
            <div className="icon">
              {item.type === "danger" ? "⚠️" : "⚠️"}
            </div>

            <div className="content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <div className="due">
                ⏰ <span>Due: {item.due}</span>
              </div>
            </div>
          </div>

          <button className="schedule-btn">Schedule</button>
        </div>
      ))}
    </div>
  );
}

export default Maintenance;
