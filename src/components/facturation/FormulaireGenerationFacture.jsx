import { FiDollarSign, FiCreditCard, FiUser } from "react-icons/fi";
import { GrNotes } from "react-icons/gr";

const FormulaireGenerationFacture = ({
  setPatient,
  setTypeConsultation,
  setMontantHt,
  setRemise,
  setPaiement,
  montantHt,
  paiment,
  typeConsultation,
}) => {
  const consultations = [
    {
      type: "Consultation générale",
      prix: 60,
    },
    {
      type: "Bilan sanguin",
      prix: 45,
    },
    {
      type: "Suivi cardiologique",
      prix: 90,
    },
    {
      type: "Radiologie",
      prix: 120,
    },
    {
      type: "Vaccination",
      prix: 35,
    },
    {
      type: "ECG",
      prix: 90,
    },
    {
      type: "Pédiatrie",
      prix: 55,
    },
    {
      type: "Bilan complet",
      prix: 150,
    },
  ];

  const paiments = [
    "Carte bancaire",
    "Espèces",
    "Virement bancaire",
    "Mutuelle/Assurance",
    "Chèque",
  ];

  return (
    <div className="billing-container md-65">
      {/* Informations de facturation */}
      <div className="billing-card">
        <div className="billing-card-header">
          <FiUser className="card-icon icon-user" />
          <h3>Informations de facturation</h3>
        </div>

        <div className="my-4">
          {/* Patient */}
          <div className="flex flex-col gap-2 my-4">
            <label>
              Patient <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FiUser className="input-icon" />
              <select onChange={(e) => setPatient(e.target.value)} required>
                <option value="">Sélectionner un patient</option>
                <option value="Soufiane Naji">Soufiane Naji</option>
                <option value="Mahdi morid">Mahdi morid</option>
                <option value="Hani Ahmed">Hani Ahmed</option>
              </select>
            </div>
          </div>

          {/* Type de consultation */}
          <div className="my-4">
            <label>
              Type de consultation <span className="text-red-400">*</span>
            </label>
            <div className="grid-cols-2">
              {consultations.map((item) => (
                <p
                  key={item.type}
                  className={`option-card ${
                    item.type.toLowerCase() === typeConsultation.toLowerCase()
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setTypeConsultation(item.type);
                    setMontantHt(item.prix);
                  }}
                >
                  <span>{item.type}</span>
                  <span>{item.prix} €</span>
                </p>
              ))}
            </div>
          </div>

          {/* Montant et Remise */}
          <div className="grid-cols-2">
            <div>
              <label>Montant personnalisé (€)</label>
              <div className="relative">
                <FiDollarSign className="input-icon" />
                <input
                  type="number"
                  placeholder={`${montantHt}`}
                  onChange={(e) => setMontantHt(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label>Remise (%)</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                onChange={(e) => setRemise(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mode de paiement */}
      <div className="billing-card">
        <div className="billing-card-header">
          <FiCreditCard className="card-icon icon-credit" />
          <h3>Mode de paiement</h3>
        </div>
        <div className="grid-cols-3">
          {paiments.map((item) => (
            <p
              key={item}
              className={`option-card ${
                item.toLowerCase() === paiment.toLowerCase() ? "active" : ""
              }`}
              onClick={() => setPaiement(item)}
            >
              <FiCreditCard className="font-semibold text-sm" />
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="billing-card">
        <div className="billing-card-header">
          <GrNotes className="card-icon icon-notes" />
          <h3>Notes (optionnel)</h3>
        </div>
        <div>
          <textarea
            placeholder="Informations complémentaires sur la facture..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default FormulaireGenerationFacture;
