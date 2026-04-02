import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, User, LogOut, Stethoscope, CalendarDays, Bell } from 'lucide-react';
import Medecins from '../pages/medecins/Medecins';

const EspacePatient = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medecins', label: 'Médecins', icon: Users },
    { id: 'rendez-vous', label: 'Mes Rendez-vous', icon: Calendar },
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];

  const dashboardCards = [
    {
      title: 'Prochain Rendez-vous',
      value: '15 Mai 2024 - 10:00',
      icon: CalendarDays,
      color: '#2E8B7F'
    },
    {
      title: 'Nombre de Médecins',
      value: '12',
      icon: Users,
      color: '#2E8B7F'
    },
    {
      title: 'Notifications',
      value: '3 nouvelles',
      icon: Bell,
      color: '#2E8B7F'
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '30px', color: '#2E8B7F', fontSize: '28px', fontWeight: 'bold' }}>
              Tableau de Bord
            </h1>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {dashboardCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <div key={index} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                    ':hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)'
                    }
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                      <Icon size={32} color={card.color} style={{ marginRight: '12px' }} />
                      <h3 style={{ margin: 0, color: '#333', fontSize: '18px', fontWeight: '600' }}>
                        {card.title}
                      </h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: card.color }}>
                      {card.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'medecins':
        return (
          <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '30px', color: '#2E8B7F', fontSize: '28px', fontWeight: 'bold' }}>
              Médecins Disponibles
            </h1>
            <Medecins />
          </div>
        );
      case 'rendez-vous':
        return (
          <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '30px', color: '#2E8B7F', fontSize: '28px', fontWeight: 'bold' }}>
              Mes Rendez-vous
            </h1>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
                Liste de vos rendez-vous à venir...
              </p>
            </div>
          </div>
        );
      case 'profil':
        return (
          <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '30px', color: '#2E8B7F', fontSize: '28px', fontWeight: 'bold' }}>
              Mon Profil
            </h1>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Nom complet
                </label>
                <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>{user?.nom || 'Non spécifié'}</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                  Email
                </label>
                <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>{user?.email || 'Non spécifié'}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleMenuClick = (id) => {
    if (id === 'logout') {
      onLogout();
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f9f8',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 32px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          margin: 0,
          color: '#2E8B7F',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          Bonjour, {user?.nom || 'Patient'} 👋
        </h2>
      </header>

      {/* Main Layout */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 73px)' }}>
        {/* Sidebar */}
        <div style={{
          width: '260px',
          backgroundColor: 'white',
          borderRight: '1px solid #e0e0e0',
          padding: '24px 0',
          boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Logo/Title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px 24px',
            borderBottom: '1px solid #e0e0e0',
            marginBottom: '16px'
          }}>
            <Stethoscope size={32} color="#2E8B7F" style={{ marginRight: '12px' }} />
            <h3 style={{
              margin: 0,
              color: '#2E8B7F',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Cabinet Médical
            </h3>
          </div>

          {/* Menu Items */}
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  marginBottom: '4px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#2E8B7F' : 'transparent',
                  color: isActive ? 'white' : '#666',
                  transition: 'all 0.3s ease',
                  borderRadius: isActive ? '8px 0 0 8px' : '0',
                  marginRight: isActive ? '8px' : '0'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = '#f0f0f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} style={{ marginRight: '12px' }} />
                <span style={{ fontWeight: '500' }}>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          backgroundColor: '#f5f9f8',
          overflowY: 'auto'
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default EspacePatient;