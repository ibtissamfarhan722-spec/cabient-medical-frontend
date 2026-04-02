import { TbClockHour4 } from "react-icons/tb";

const RendezVousCard = ({ nom, etat, temps, type, medecin }) => {
  return (
    <div className="rdv-item">
      <div className="rdv-avatar">{nom.slice(0, 1)}</div>

      <div className="rdv-content">
        <div className="rdv-info">
          <h5>{nom}</h5>
          <p>
            {type} · {medecin}
          </p>
        </div>

        <div className="rdv-meta">
          <div className="rdv-time">
            <TbClockHour4 className="icon" />
            <span>{temps}</span>
          </div>
          <span
            className={`rdv-status ${etat.toLowerCase().replace(" ", "-")}`}
          >
            {etat}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RendezVousCard;
