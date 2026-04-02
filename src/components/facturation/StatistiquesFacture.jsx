import { TbClockHour4 } from "react-icons/tb";
import { FiCheckCircle } from "react-icons/fi";
import { IoIosTrendingUp } from "react-icons/io";

const StatistiquesFacture = () => {
  const statistiques = [
    {
      icon: <FiCheckCircle />,
      text: "Revenus perçus",
      total: "485 €",
      iconStyle: "perçus",
    },
    {
      icon: <TbClockHour4 />,
      text: "En attente",
      total: "270 €",
      iconStyle: "attente",
    },
    {
      icon: <IoIosTrendingUp />,
      text: "En retard",
      total: "120 €",
      iconStyle: "retard",
    },
  ];

  return (
    <div className="stats-container">
      {statistiques.map((item) => (
        <div key={item.total} className="stat-card">
          <span className={`stat-icon ${item.iconStyle}`}>{item.icon}</span>
          <div className="stat-text">
            <p>{item.text}</p>
            <h5>{item.total}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatistiquesFacture;
