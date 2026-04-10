import React, { useState } from 'react';
import { Search, Stethoscope, Video, Home, Building } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('cabinet');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const tabs = [
    { id: 'cabinet', label: 'Au Cabinet', icon: Home },
    { id: 'video', label: 'En Vidéo', icon: Video },
    { id: 'domicile', label: 'A Domicile', icon: Home },
    { id: 'clinique', label: 'À La Clinique', icon: Building, badge: 'Nouveau' }
  ];

  const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes'];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          animation: 'fadeIn 1s ease-in'
        }}>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '30px',
            lineHeight: '1.2'
          }}>
            Prenez rendez-vous avec votre médecin{' '}
            <span style={{ color: '#FFD700' }}>au cabinet ou en vidéo</span>
          </h1>

          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div style={{ flex: '1', minWidth: '200px', textAlign: 'center' }}>
              <Stethoscope size={120} color="#2E8B7F" />
            </div>
            <div style={{ flex: '2', minWidth: '250px' }}>
              <h2 style={{
                fontSize: '1.8rem',
                marginBottom: '15px',
                color: '#333'
              }}>
                Consultation en vidéo où que vous soyez
              </h2>
              <p style={{
                color: '#666',
                marginBottom: '20px',
                fontSize: '1.1rem'
              }}>
                Consultez votre médecin depuis chez vous, en toute sécurité.
              </p>
              <button style={{
                background: 'linear-gradient(45deg, #2E8B7F, #FFD700)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(46, 139, 127, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 20px rgba(46, 139, 127, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(46, 139, 127, 0.3)';
              }}>
                Prenez Rendez-vous
              </button>
            </div>
          </div>
        </div>

        {/* Appointment Type Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.2)',
                  color: activeTab === tab.id ? '#333' : 'white',
                  border: 'none',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  boxShadow: activeTab === tab.id ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <Icon size={18} />
                {tab.label}
                {tab.badge && (
                  <span style={{
                    background: '#FFD700',
                    color: '#333',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    marginLeft: '5px'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Section */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
          animation: 'fadeIn 1s ease-in 0.5s both'
        }}>
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <input
              type="text"
              placeholder="Spécialité, médecin, établissement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: '1',
                minWidth: '250px',
                padding: '18px 20px',
                borderRadius: '15px',
                border: '2px solid #e0e0e0',
                fontSize: '1.1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2E8B7F'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                padding: '18px 20px',
                borderRadius: '15px',
                border: '2px solid #e0e0e0',
                fontSize: '1.1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease',
                minWidth: '200px',
                fontFamily: 'inherit',
                background: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2E8B7F'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            >
              <option value="">Choisir une ville</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button style={{
            width: '100%',
            background: 'linear-gradient(45deg, #FFA500, #FFD700)',
            color: 'white',
            border: 'none',
            padding: '18px',
            borderRadius: '15px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(255, 165, 0, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 165, 0, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(255, 165, 0, 0.3)';
          }}>
            <Search size={24} />
            Rechercher
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;

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