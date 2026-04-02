import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import medecinsData from '../data/medecins.json';

const ProfilMedecin = () => {
  const { id } = useParams();
  const [medecin, setMedecin] = useState(null);
  const [selectedType, setSelectedType] = useState('cabinet');

  useEffect(() => {
    const foundMedecin = medecinsData.find(m => m.id === parseInt(id));
    setMedecin(foundMedecin);
  }, [id]);

  if (!medecin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const consultationTypes = [
    { id: 'cabinet', label: 'Au Cabinet', icon: '🏥' },
    { id: 'video', label: 'En Vidéo', icon: '📹' },
    { id: 'domicile', label: 'À Domicile', icon: '🏠' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Retour à la recherche
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <img
                  src={medecin.photo}
                  alt={`Dr. ${medecin.nom}`}
                  className="w-32 h-32 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {medecin.nom}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {medecin.specialites.map((specialite, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {specialite}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 flex items-center mb-4">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {medecin.ville}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {medecin.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Horaires d'ouverture
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {medecin.horaires.map((horaire, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">
                      {horaire.split(': ')[0]}
                    </span>
                    <span className="text-gray-600">
                      {horaire.split(': ')[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Prendre rendez-vous
              </h2>

              {/* Type de consultation */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Type de consultation
                </p>
                <div className="space-y-2">
                  {consultationTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full flex items-center p-3 rounded-lg border transition-colors duration-200 ${
                        selectedType === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg mr-3">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bouton de réservation */}
              <Link
                to={`/reservation/${medecin.id}?type=${selectedType}`}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-green-700 transition-colors duration-200 block"
              >
                Réserver un rendez-vous
              </Link>

              {/* Prochaines disponibilités */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Prochaines disponibilités
                </h3>
                <div className="space-y-2">
                  {medecin.disponibilites.slice(0, 3).map((dispo, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <span className="font-medium">
                        {new Date(dispo.date).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                      <span className="ml-2">
                        {dispo.heures.slice(0, 2).join(', ')}
                        {dispo.heures.length > 2 && '...'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilMedecin;