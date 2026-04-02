import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './style/add.css';
import { ajouter } from '../../store/VehiculeReducer';

function Add() {
  const [form, setForm] = useState({
    client: "",
    immatriculation: "",
    vin: "",
    marque: "",
    modele: "",
    annee: "",
    kilometrage: ""
  });

  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError(""); // clear alert while typing
  };

  const handleAdd = (e) => {
    e.preventDefault();

    for (let key in form) {
      if (!form[key]) {
        setError("Tous les champs sont obligatoires");
        return;
      }
    }

    dispatch(ajouter(form));
    setError("");

    setForm({
      client: "",
      immatriculation: "",
      vin: "",
      marque: "",
      modele: "",
      annee: "",
      kilometrage: ""
    });
  };

  const isInvalid = (field) => error && !form[field];

  return (
    <div className="add-page">
      <form onSubmit={handleAdd} className="add-form">

        {/* 🔴 ALERT */}
        {error && (
          <div className="form-alert">
            ⚠️ {error}
          </div>
        )}

        <div className="cards-row">

          <div className="card">
            <h2 className="card-title">Informations du Véhicule</h2>

            <div className="input-group">
              <label>ID Client *</label>
              <input
                className={isInvalid("client") ? "input-error" : ""}
                type="number"
                name="client"
                value={form.client}
                onChange={HandleChange}
                placeholder="101"
              />
            </div>

            <div className="input-group">
              <label>Immatriculation *</label>
              <input
                className={isInvalid("immatriculation") ? "input-error" : ""}
                type="text"
                name="immatriculation"
                value={form.immatriculation}
                onChange={HandleChange}
                placeholder="ABC-1234"
              />
            </div>

            <div className="input-group">
              <label>VIN *</label>
              <input
                className={isInvalid("vin") ? "input-error" : ""}
                type="text"
                name="vin"
                value={form.vin}
                onChange={HandleChange}
                placeholder="1HGBH41JXMN109186"
              />
            </div>

            <div className="input-group">
              <label>Marque *</label>
              <input
                className={isInvalid("marque") ? "input-error" : ""}
                type="text"
                name="marque"
                value={form.marque}
                onChange={HandleChange}
                placeholder="Toyota"
              />
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Détails du Véhicule</h2>

            <div className="input-group">
              <label>Modèle *</label>
              <input
                className={isInvalid("modele") ? "input-error" : ""}
                type="text"
                name="modele"
                value={form.modele}
                onChange={HandleChange}
                placeholder="Camry"
              />
            </div>

            <div className="input-group">
  <label>Année *</label>
  <input
    type="text"
    name="annee"
    value={form.annee}
    placeholder="2020"
    maxLength={4}
    className={isInvalid("annee") ? "input-error" : ""}
    onChange={(e) => {
      const value = e.target.value.replace(/\D/g, ""); // only numbers
      if (value.length <= 4) {
        setForm(prev => ({ ...prev, annee: value }));
        setError("");
      }
    }}
  />
</div>


            <div className="input-group">
              <label>Kilométrage *</label>
              <input
                className={isInvalid("kilometrage") ? "input-error" : ""}
                type="number"
                name="kilometrage"
                value={form.kilometrage}
                onChange={HandleChange}
                placeholder="45230"
              />
            </div>
          </div>

        </div>

        <div className="form-footer">
          <button type="button" className="btn-cancel">Annuler</button>
          <button type="submit" className="btn-submit">+ Ajouter le Véhicule</button>
        </div>

      </form>
    </div>
  );
}

export default Add;
