import React from "react";

function MedecinCard({ medecin }) {
  return (
    <div className="border p-4 rounded shadow">
      <p className="font-semibold">{medecin.nom}</p>
      <p>{medecin.specialite} - {medecin.region}</p>
    </div>
  );
}

export default MedecinCard;