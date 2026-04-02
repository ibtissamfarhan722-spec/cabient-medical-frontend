import { useState } from "react";
import Filtre from "../../components/Filtre";
import MedecinCard from "../../components/MedecinCard";

const data = [
  { id: 1, nom: "Dr Ahmed", ville: "Casablanca", specialite: "Cardiologue" },
  { id: 2, nom: "Dr Sara", ville: "Rabat", specialite: "Dentiste" },
  { id: 3, nom: "Dr Yassine", ville: "Casablanca", specialite: "Dermatologue" },
];

export default function Medecins() {
  const [medecins, setMedecins] = useState(data);

  const handleSearch = ({ specialite, ville }) => {
    const filtered = data.filter((m) => {
      return (
        (specialite === "" ||
          m.specialite.toLowerCase().includes(specialite.toLowerCase())) &&
        (ville === "" || m.ville === ville)
      );
    });

    setMedecins(filtered);
  };

  return (
    <div>
      <h2>Liste des médecins</h2>

      <Filtre onSearch={handleSearch} />

      {medecins.map((m) => (
        <MedecinCard key={m.id} medecin={m} />
      ))}
    </div>
  );
}