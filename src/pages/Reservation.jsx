import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import medecinsData from "../data/medecins.json";

export default function Reservation() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [medecin, setMedecin] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientInfo, setPatientInfo] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: ""
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const typeConsultation = searchParams.get("type") || "cabinet";

  useEffect(() => {
    if (!id) return;

    const foundMedecin = medecinsData.find(
      (m) => m.id === Number(id)
    );

    setMedecin(foundMedecin);
  }, [id]);

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !selectedDate ||
      !selectedTime ||
      !patientInfo.nom ||
      !patientInfo.prenom ||
      !patientInfo.telephone ||
      !patientInfo.email
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setIsConfirmed(true);
  };

  const availableSlots =
    medecin?.disponibilites.find((d) => d.date === selectedDate)?.heures || [];

  if (!medecin) {
    return <p>Chargement...</p>;
  }

  if (isConfirmed) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-green-600 text-xl">
          Rendez-vous confirmé ✅
        </h1>
        <p>{medecin.nom}</p>
        <p>{selectedDate}</p>
        <p>{selectedTime}</p>

        <Link to="/" className="text-blue-600">
          Retour
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1>Réservation</h1>

      {/* Date */}
      <select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      >
        <option value="">Choisir date</option>
        {medecin.disponibilites.map((d) => (
          <option key={d.date} value={d.date}>
            {d.date}
          </option>
        ))}
      </select>

      {/* Heure */}
      {selectedDate && (
        <div>
          {availableSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      {/* Inputs */}
      <input
        placeholder="Prénom"
        onChange={(e) =>
          handlePatientInfoChange("prenom", e.target.value)
        }
      />

      <input
        placeholder="Nom"
        onChange={(e) =>
          handlePatientInfoChange("nom", e.target.value)
        }
      />

      <button onClick={handleSubmit}>
        Confirmer
      </button>
    </div>
  );
}