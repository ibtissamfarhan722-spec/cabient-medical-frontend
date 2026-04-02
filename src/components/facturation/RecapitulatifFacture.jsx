import { useEffect, useState } from "react";
import { BsJournalMedical } from "react-icons/bs";
import { MdNoteAdd } from "react-icons/md";
import { Link } from "react-router-dom";

const RecapitulatifFacture = ({
  patient,
  typeConsultation,
  montantHt,
  remise,
  paiment,
  setPrixTTC,
  prixTTC,
}) => {
  const tva = 20;

  const [tvaTotal, setTvaTotal] = useState(0);
  const [remiseTotal, setRemiseTotal] = useState();

  useEffect(() => {
    if (montantHt > 0) {
      const tauxRemise = remise / 100;
      const tauxTva = tva / 100;

      const remiseMontant = montantHt * tauxRemise;
      const htApresRemise = montantHt - remiseMontant;
      const tvaMontant = htApresRemise * tauxTva;
      const ttc = htApresRemise + tvaMontant;

      setRemiseTotal(remiseMontant);
      setTvaTotal(tvaMontant);
      setPrixTTC(ttc);
    }
  }, [montantHt, typeConsultation, remise]);

  return (
    <div className="billing-summary-container md-35">
      {/* Carte récapitulatif */}
      <div className="billing-summary-card">
        <h2 className="billing-summary-title">Récapitulatif</h2>

        <div className="billing-summary-section">
          <div className="summary-row">
            <span className="summary-label">Patient</span>
            {patient ? (
              <span className="summary-value">{patient}</span>
            ) : (
              <span className="summary-placeholder"></span>
            )}
          </div>
          <div className="summary-row">
            <span className="summary-label">Consultation</span>
            {typeConsultation ? (
              <span className="summary-value">{typeConsultation}</span>
            ) : (
              <span className="summary-placeholder"></span>
            )}
          </div>
          <div className="summary-row">
            <span className="summary-label">Paiement</span>
            <span className="summary-value font-semibold">{paiment}</span>
          </div>
        </div>

        <div className="billing-summary-section border-section">
          <div className="summary-row">
            <span className="summary-label">Montant HT</span>
            <span className="summary-value">
              {montantHt ? montantHt : "0.00"} €
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">TVA (20%)</span>
            <span className="summary-value">
              {tvaTotal ? tvaTotal.toFixed(2) : "0.00"} €
            </span>
          </div>
          {remise ? (
            <div className="summary-row summary-remise">
              <span className="summary-remise-label">Remise ({remise}%)</span>
              <span className="summary-remise-value">
                -{remiseTotal.toFixed(2)} €
              </span>
            </div>
          ) : null}
        </div>

        <div className="summary-total">
          <span className="summary-total-label">Total TTC</span>
          <span className="summary-total-value">
            {prixTTC ? prixTTC.toFixed(2) : "0.00"} €
          </span>
        </div>
      </div>

      {/* Carte informations cabinet */}
      <div className="billing-cabinet-card">
        <div className="cabinet-header">
          <BsJournalMedical className="cabinet-icon" />
          <h4 className="cabinet-title">Cabinet Médical</h4>
        </div>
        <div className="cabinet-info">
          <p>Dr. Jean Martin</p>
          <p>12 Rue de la Santé, 75013 Paris</p>
          <p>SIRET: 123 456 789 00012</p>
        </div>
      </div>

      {/* Boutons */}
      <button className="btn-generate">
        <MdNoteAdd />
        Générer une facture
      </button>
      <Link to="/facturation" className="btn-cancel">
        Annuler
      </Link>
    </div>
  );
};

export default RecapitulatifFacture;
