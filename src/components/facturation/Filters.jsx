import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const Filters = ({ setPatient, setPaiement, setStatut }) => {
  const [active, setActive] = useState("");
  return (
    <div className="filter-container">
      <div className="search-box">
        <IoSearchOutline className="search-icon" />
        <input
          type="text"
          placeholder="Recherche par patient ou N° facture..."
          onChange={(e) => setPatient(e.target.value)}
        />
      </div>

      <select
        onChange={(e) => setPaiement(e.target.value)}
        className="select-box"
      >
        <option value="">Tous</option>
        <option value="carte bancaire">Carte bancaire</option>
        <option value="espèce">Espèces</option>
        <option value="virement">Virement</option>
        <option value="mutuelle">Mutuelle</option>
      </select>

      <div className="status-buttons">
        <button
          className={active === "" ? "btn active" : "btn"}
          onClick={() => {
            setActive("");
            setStatut("");
          }}
        >
          Tous
        </button>
        <button
          className={active === "payé" ? "btn active" : "btn"}
          onClick={() => {
            setActive("payé");
            setStatut("payé");
          }}
        >
          Payé
        </button>
        <button
          className={active === "en attente" ? "btn active" : "btn"}
          onClick={() => {
            setActive("en attente");
            setStatut("en attente");
          }}
        >
          En attente
        </button>
        <button
          className={active === "en retard" ? "btn active" : "btn"}
          onClick={() => {
            setActive("en retard");
            setStatut("en retard");
          }}
        >
          En retard
        </button>
      </div>
    </div>
  );
};

export default Filters;
