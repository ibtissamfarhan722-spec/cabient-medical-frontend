import React, { useState, useEffect } from 'react';
import MedecinCard from '../components/MedecinCard';
import Filtre from '../components/Filtre';
import medecinsData from '../data/medecins.json';

const Home = () => {
  const [medecins, setMedecins] = useState([]);
  const [filteredMedecins, setFilteredMedecins] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    ville: '',
    typeConsultation: ''
  });

  useEffect(() => {
    setMedecins(medecinsData);
    setFilteredMedecins(medecinsData);
  }, []);

  useEffect(() => {
    let filtered = medecins;

    // Filtre par recherche (nom, spécialité)
    if (filters.search) {
      filtered = filtered.filter(medecin =>
        medecin.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        medecin.specialites.some(spec =>
          spec.toLowerCase().includes(filters.search.toLowerCase())
        )
      );
    }

    // Filtre par ville
    if (filters.ville) {
      filtered = filtered.filter(medecin => medecin.ville === filters.ville);
    }

    // Pour le type de consultation, on pourrait filtrer selon les disponibilités
    // Ici on garde tous les médecins car tous peuvent proposer différents types

    setFilteredMedecins(filtered);
  }, [filters, medecins]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    // La recherche est déjà gérée par useEffect
    console.log('Recherche effectuée avec les filtres:', filters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Prenez rendez-vous avec votre médecin
            </h1>
            <p className="text-xl text-blue-100">
              Au cabinet, en vidéo ou à domicile
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <Filtre
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Résultats */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Médecins disponibles
          </h2>
          <p className="text-gray-600">
            {filteredMedecins.length} médecin{filteredMedecins.length > 1 ? 's' : ''} trouvé{filteredMedecins.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille de médecins */}
        {filteredMedecins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedecins.map(medecin => (
              <MedecinCard key={medecin.id} medecin={medecin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun médecin trouvé
            </h3>
            <p className="text-gray-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;