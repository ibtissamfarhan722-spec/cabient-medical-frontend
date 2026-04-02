import React from 'react'
import './style/confirmDeleteModal.css'

function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h2>Confirmer la suppression</h2>

        <p>
          Êtes-vous sûr de vouloir supprimer ce véhicule ?  
          Cette action est <strong>irréversible</strong>.
        </p>

        <div className="confirm-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            Annuler
          </button>
          <button className="delete-btn" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
