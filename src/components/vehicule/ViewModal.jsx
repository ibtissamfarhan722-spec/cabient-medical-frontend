import React from 'react'
import './style/viewModal.css'

function ViewModal({ vehicule, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="view-modal">
        <h1>Détails du Véhicule</h1>

        <div className="section">
          <h2>Informations du Véhicule</h2>

          <div className="info-item">
            <span className="label">ID Véhicule</span>
            <span className="value">{vehicule.IdVehicule}</span>
          </div>

          <div className="info-item">
            <span className="label">ID Client</span>
            <span className="value">{vehicule.client}</span>
          </div>

          <div className="info-item">
            <span className="label">Immatriculation</span>
            <span className="value">{vehicule.immatriculation}</span>
          </div>

          <div className="info-item">
            <span className="label">VIN</span>
            <span className="value">{vehicule.vin}</span>
          </div>
        </div>

        <div className="section">
          <h2>Détails</h2>

          <div className="info-item">
            <span className="label">Marque</span>
            <span className="value">{vehicule.marque}</span>
          </div>

          <div className="info-item">
            <span className="label">Modèle</span>
            <span className="value">{vehicule.modele}</span>
          </div>

          <div className="info-item">
            <span className="label">Année</span>
            <span className="value">{vehicule.annee}</span>
          </div>

          <div className="info-item">
            <span className="label">Kilométrage</span>
            <span className="value">{vehicule.kilometrage} km</span>
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  )
}

export default ViewModal
