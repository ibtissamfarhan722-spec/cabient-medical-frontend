import React from "react";
import "./style/serviceHistory.css";

const services = [
  {
    date: "2024-11-17",
    service: "Oil Change",
    technician: "John Smith",
    cost: "$89.99",
    status: "Completed",
  },
  {
    date: "2024-09-22",
    service: "Brake Service",
    technician: "Sarah Johnson",
    cost: "$345.50",
    status: "Completed",
  },
  {
    date: "2024-07-10",
    service: "A/C Service",
    technician: "Mike Davis",
    cost: "$165.00",
    status: "Completed",
  },
  {
    date: "2024-05-05",
    service: "Tire Rotation",
    technician: "John Smith",
    cost: "$75.00",
    status: "Completed",
  },
  {
    date: "2024-02-18",
    service: "Engine Diagnostic",
    technician: "Sarah Johnson",
    cost: "$425.75",
    status: "Completed",
  },
];

function ServiceHistory() {
  return (
    <div className="history-container">
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Service</th>
            <th>Technician</th>
            <th>Cost</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {services.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.service}</td>
              <td>{item.technician}</td>
              <td className="cost">{item.cost}</td>
              <td>
                <span className="status completed">{item.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceHistory;
