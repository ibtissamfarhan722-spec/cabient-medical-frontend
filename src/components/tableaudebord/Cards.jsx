import { FiUsers } from "react-icons/fi";
import { IoIosTrendingUp } from "react-icons/io";
import { MdOutlineCancel } from "react-icons/md";
import { FaRegCalendarDays } from "react-icons/fa6";
import Card from "./Card";

const Cards = () => {
  let data = [
    {
      icon: <FiUsers />,
      total: "1,284",
      text: "Total Patients",
      percent: "+12.5%",
      style: "user",
    },
    {
      icon: <FaRegCalendarDays />,
      total: "140",
      text: "RDV ce mois",
      percent: "+8.2%",
      style: "calenadr",
    },
    {
      icon: <IoIosTrendingUp />,
      total: "24 600 $",
      text: "Revenus mensuels",
      percent: "+14.1%",
      style: "revenu",
    },
    {
      icon: <MdOutlineCancel />,
      total: "9.3%",
      text: "Taux d'annulation",
      percent: "-2.4%",
      style: "annulation",
    },
  ];

  return (
    <div className="cards-container">
      {data.map((item, i) => (
        <Card
          key={i}
          text={item.text}
          icon={item.icon}
          percent={item.percent}
          total={item.total}
          style={item.style}
        />
      ))}
    </div>
  );
};

export default Cards;
