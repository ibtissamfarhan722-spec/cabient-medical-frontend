import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, User, Mail, Phone } from 'lucide-react';

const General = ({ user }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  // Mettre à jour le formulaire quand les données utilisateur arrivent
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Optionnel : Appel API pour mettre à jour en base de données
      // await axios.put(`http://127.0.0.1:8000/api/user/${user.id}`, formData);
      alert("Informations mises à jour !");
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="settings-section">
      <h2 style={{ marginBottom: '20px' }}>Informations Personnelles</h2>
      
      <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label className="form-label">Prénom</label>
            <input 
              className="form-input" 
              value={formData.first_name} 
              onChange={e => setFormData({...formData, first_name: e.target.value})}
            />
          </div>
          <div>
            <label className="form-label">Nom</label>
            <input 
              className="form-input" 
              value={formData.last_name} 
              onChange={e => setFormData({...formData, last_name: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="form-label">Adresse Email</label>
          <input 
            className="form-input" 
            type="email" 
            value={formData.email} 
            disabled // Souvent l'email ne se change pas facilement
          />
        </div>

        <div>
          <label className="form-label">Téléphone</label>
          <input 
            className="form-input" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
          <Save size={18} /> Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

export default General;