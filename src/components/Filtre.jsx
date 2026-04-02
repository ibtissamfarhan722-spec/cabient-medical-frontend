import React, { useState } from "react";

function Filtre({ setFilters }) {
  const [specialite, setSpecialite] = useState("");
  const [region, setRegion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters({ specialite, region });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Spécialité"
        value={specialite}
        onChange={(e) => setSpecialite(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Région"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Rechercher
      </button>
    </form>
  );
}

export default Filtre;