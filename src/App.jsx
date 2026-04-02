import React, { useState, useEffect } from 'react';
import AuthSystem from './auth/AuthSystem';
import EspaceMedecin from './EspaceMedecin/EspaceMedecin';
import EspacePatient from './EspacePatient/EspacePatient';
import EspaceSecretaire from './EspaceSecretaire/EspaceSecretaire';
import EspaceAdmin from './EspaceAdmin/EspaceAdmin';
import axios from 'axios';
// Config globale Axios
axios.defaults.headers.common['Accept'] = 'application/json';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si quelqu'un est déjà connecté au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const handleLogout = () => {
  localStorage.removeItem('user');  // ✅ Supprime seulement l'utilisateur connecté
  localStorage.removeItem('token'); // ✅ Supprime seulement le jeton
  setUser(null);
};

  // --- LOGIQUE DE RENDU DES ESPACES ---
  const renderContent = () => {
    if (!user) {
      return <AuthSystem onAuthSuccess={handleLoginSuccess} />;
    }

    // 1. Condition Spéciale pour l'Admin 
    // (Note: assurez-vous que votre backend renvoie ces infos dans l'objet user)
    if (user.email === 'admin@gmail.com' && user.password === 'admin123') {
      return <EspaceAdmin user={user} onLogout={handleLogout} />;
    }

    // 2. Switch pour les rôles standards
    switch (user.role) {
      case 'medecin':
        return <EspaceMedecin user={user} onLogout={handleLogout} />;
      case 'patient':
        return <EspacePatient user={user} onLogout={handleLogout} />;
      case 'secretaire':
        return <EspaceSecretaire user={user} onLogout={handleLogout} />;
      case 'admin': // Au cas où le rôle est aussi défini comme 'admin' par le backend
        return <EspaceAdmin user={user} onLogout={handleLogout} />;
      default:
        // Si le rôle n'est pas reconnu, on déconnecte par sécurité
        return <AuthSystem onAuthSuccess={handleLoginSuccess} />;
    }
  };

  if (loading) return null;

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;