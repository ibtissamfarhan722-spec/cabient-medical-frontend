import { BsArrowUpRight, BsArrowDownRight } from "react-icons/bs";

const Card = ({ text, total, icon, percent, style }) => {
  return (
    <div className="card">
      <div className="card-header">
        <span className={`icon-box ${style}`}>{icon}</span>

        <span
          className={`percent ${
            parseInt(percent) > 0 ? "positive" : "negative"
          }`}
        >
          {parseInt(percent) > 0 ? <BsArrowUpRight /> : <BsArrowDownRight />}
          {percent}
        </span>
      </div>

      <div className="card-body">
        <h5 className="card-total">{total}</h5>
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
};

export default Card;
