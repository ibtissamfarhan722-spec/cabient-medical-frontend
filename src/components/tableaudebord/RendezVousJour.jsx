import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import RendezVousCard from "./RendezVousCard";

const RendezVousJour = () => {
  const rendezVous = [
    {
      nom: "Sophie Martin",
      etat: "Confirmé",
      temps: "09:00",
      type: "Consultation",
      medecin: "Dr. Dupont",
    },
    {
      nom: "Marc Leblanc",
      etat: "En attente",
      temps: "10:30",
      type: "Bilan sanguin",
      medecin: "Dr. Bernard",
    },
    {
      nom: "Claire Moreau",
      etat: "Terminé",
      temps: "11:00",
      type: "Suivi",
      medecin: "Dr. Dupont",
    },
    {
      nom: "Pierre Garnier",
      etat: "Annulé",
      temps: "14:00",
      type: "Consultation",
      medecin: "Dr. Petit",
    },
    {
      nom: "Alice Fontaine",
      etat: "Confirmé",
      temps: "15:30",
      type: "Vaccination",
      medecin: "Dr. Bernard",
    },
  ];
  return (
    <div className="rdv-section">
      <div className="rdv-header">
        <div className="rdv-header-title">
          <h3>Rendez-vous du jour</h3>
          <p>Mardi 3 mars 2026</p>
        </div>
        <Link to="/rendez-vous" className="rdv-header-link">
          Voir tout <FaArrowRightLong className="icon" />
        </Link>
      </div>
      <div className="rdv-cards-container">
        {rendezVous.map((item, i) => (
          <RendezVousCard
            key={i}
            nom={item.nom}
            etat={item.etat}
            temps={item.temps}
            medecin={item.medecin}
            type={item.type}
          />
        ))}
      </div>
    </div>
  );
};

export default RendezVousJour;
