import React, { useState } from 'react'
import './style/updateModal.css'
import { useDispatch } from 'react-redux'
import { modifier } from '../../store/VehiculeReducer'

function UpdateModal({ vehicule, onClose }) {

  const [form, setForm] = useState({
    IdVehicule: vehicule.IdVehicule,
    client: vehicule.client || '',
    immatriculation: vehicule.immatriculation || '',
    vin: vehicule.vin || '',
    marque: vehicule.marque || '',
    modele: vehicule.modele || '',
    annee: vehicule.annee || '',
    kilometrage: vehicule.kilometrage || ''
  })

  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    dispatch(modifier(form))  
    onClose()
  }

  return (
    <div className="modal-overlay">
  <div className="update-modal">
    <div className="modal-header">
      <h1>Modifier le Véhicule</h1>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>

    <div className="modal-content">
      <div className="column">
        <h2>Informations du Véhicule</h2>

        <div className="field">
          <label>ID Véhicule</label>
          <input type="number" value={form.IdVehicule} disabled />
        </div>

        <div className="field">
          <label>ID Client</label>
          <input type="number" name="client" value={form.client} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Immatriculation</label>
          <input type="text" name="immatriculation" value={form.immatriculation} onChange={handleChange} />
        </div>

        <div className="field">
          <label>VIN</label>
          <input type="text" name="vin" value={form.vin} onChange={handleChange} />
        </div>
      </div>

      <div className="column">
        <h2>Détails</h2>

        <div className="field">
          <label>Marque</label>
          <input type="text" name="marque" value={form.marque} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Modèle</label>
          <input type="text" name="modele" value={form.modele} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Année</label>
          <input type="number" name="annee" value={form.annee} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Kilométrage</label>
          <input type="number" name="kilometrage" value={form.kilometrage} onChange={handleChange} />
        </div>
      </div>
    </div>

    <div className="modal-footer">
      <button className="cancel-btn" onClick={onClose}>Annuler</button>
      <button className="save-btn" onClick={handleSave}>Enregistrer</button>
    </div>
  </div>
</div>

  )
}

export default UpdateModal
