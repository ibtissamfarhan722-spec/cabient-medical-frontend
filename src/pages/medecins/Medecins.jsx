import React, { useState, useEffect, useRef } from 'react';
import { Search, Stethoscope, MapPin, Check } from 'lucide-react';

const initialData = [
  { id: 1, nom: 'Dr Ahmed', ville: 'Casablanca', specialite: 'Cardiologue' },
  { id: 2, nom: 'Dr Sara', ville: 'Rabat', specialite: 'Dentiste' },
  { id: 3, nom: 'Dr Yassine', ville: 'Casablanca', specialite: 'Dermatologue' },
  { id: 4, nom: 'Dr Anissa', ville: 'Marrakech', specialite: 'Pédiatre' },
  { id: 5, nom: 'Dr Karim', ville: 'Fès', specialite: 'Généraliste' },
];

const cityOptions = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès',
  'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'El Jadida', 'Nador', 'Beni Mellal',
  'Khouribga', 'Taza', 'Laâyoune', 'Dakhla',
];

function CityDropdown({ selectedCity, onSelectCity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredCities = cityOptions.filter((city) =>
    city.toLowerCase().includes(normalizedSearch),
  );

  const displayValue = isOpen ? searchTerm : selectedCity;

  return (
    <div
      ref={dropdownRef}
      style={{
        flex: 1,
        minWidth: 180,
        position: 'relative',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: 12,
          height: 45,
          padding: '0 12px',
          gap: 8,
          boxShadow: isOpen ? '0 5px 20px rgba(0,0,0,0.1)' : 'none',
          cursor: 'text',
          transition: 'all 0.2s ease',
        }}
        onClick={() => {
          setIsOpen(true);
          setSearchTerm(selectedCity || '');
        }}
      >
        <MapPin size={16} color="#6B7280" />
        <input
          type="text"
          value={displayValue || ''}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm(selectedCity || '');
          }}
          placeholder="Choisir une ville"
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            height: '100%',
            fontSize: 15,
            color: '#1f2937',
            backgroundColor: 'transparent',
          }}
        />
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 52,
            left: 0,
            right: 0,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 20,
            marginTop: 8,
            animation: 'fadeInDropdown 0.2s ease',
          }}
        >
          {(filteredCities.length > 0 ? filteredCities : ['Aucune ville trouvée']).map((city) => {
            const isSelected = city === selectedCity;
            return (
              <div
                key={city}
                onClick={() => {
                  if (city === 'Aucune ville trouvée') return;
                  onSelectCity(city);
                  setSearchTerm(city);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: isSelected ? '#effcf1' : '#fff',
                  color: isSelected ? '#065f46' : '#1f2937',
                  cursor: city === 'Aucune ville trouvée' ? 'default' : 'pointer',
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f7f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? '#effcf1' : '#fff';
                }}
              >
                <span>{city}</span>
                {isSelected && city !== 'Aucune ville trouvée' && <Check size={14} color="#16a34a" />}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeInDropdown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function Medecins({ setActiveTab, setSelectedMedecin }) {
  const [medecins, setMedecins] = useState(initialData);
  const [specialite, setSpecialite] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // 🔥 FILTRAGE DYNAMIQUE - se déclenche à chaque changement de filtre
  useEffect(() => {
    const filtered = initialData.filter((m) => {
      const searchTerm = specialite.trim().toLowerCase();
      
      // Recherche sur spécialité, nom du médecin, ou établissement
      const matchesSearch =
        searchTerm === '' ||
        m.specialite.toLowerCase().includes(searchTerm) ||
        m.nom.toLowerCase().includes(searchTerm);
      
      const matchesVille =
        selectedCity.trim() === '' ||
        m.ville.toLowerCase() === selectedCity.trim().toLowerCase();

      return matchesSearch && matchesVille;
    });
    
    setMedecins(filtered);
  }, [specialite, selectedCity]); // Dépendances : se réexécute quand ces valeurs changent

  // Réinitialiser la ville
  const clearCity = () => setSelectedCity('');

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif', color: '#334155' }}>
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 22,
          boxShadow: '0 5px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Stethoscope color="#2E8B7F" />
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Médecins Disponibles</h2>
        </div>

        {/* Barre de filtres dynamiques - plus de formulaire */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
            <input
              value={specialite}
              onChange={(e) => setSpecialite(e.target.value)}
              placeholder="Spécialité, médecin, établissement..."
              style={{
                width: '100%',
                height: 45,
                borderRadius: 10,
                border: '1px solid #ddd',
                padding: '0 12px 0 40px',
                fontSize: 15,
                backgroundColor: '#f8fafc',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <CityDropdown selectedCity={selectedCity} onSelectCity={setSelectedCity} />

          {/* Indicateur de filtres actifs + bouton reset */}
          {(specialite || selectedCity) && (
            <button
              onClick={() => {
                setSpecialite('');
                setSelectedCity('');
              }}
              style={{
                height: 45,
                padding: '0 16px',
                borderRadius: 10,
                border: '1px solid #ddd',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              Réinitialiser ✕
            </button>
          )}
        </div>

        {/* Compteur de résultats */}
        <div style={{ marginBottom: 16, color: '#64748b', fontSize: 14 }}>
          {medecins.length} médecin{medecins.length > 1 ? 's' : ''} trouvé{medecins.length > 1 ? 's' : ''}
          {(specialite || selectedCity) && ' (filtres actifs)'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {medecins.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
              <p style={{ margin: 0, fontSize: 16 }}>Aucun médecin ne correspond à vos critères.</p>
              <button
                onClick={() => {
                  setSpecialite('');
                  setSelectedCity('');
                }}
                style={{
                  marginTop: 12,
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#2E8B7F',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Effacer les filtres
              </button>
            </div>
          ) : (
            medecins.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f9fafb',
                  borderRadius: 12,
                  padding: 14,
                  boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.01)';
                  e.currentTarget.style.boxShadow = '0 8px 18px rgba(0,0,0,0.11)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.04)';
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{m.nom}</p>
                  <p style={{ margin: '5px 0 0', fontSize: 14, color: '#64748b' }}>
                    {m.specialite} · {m.ville}
                  </p>
                </div>
                <button
                  style={{
                    border: 'none',
                    backgroundColor: '#2E8B7F',
                    color: '#fff',
                    borderRadius: 10,
                    padding: '9px 16px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#256f62';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2E8B7F';
                  }}
                  onClick={() => alert(`Prendre RDV avec ${m.nom}`)}
                >
                  Prendre RDV
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}