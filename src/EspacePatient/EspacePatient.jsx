import React, { useState, useMemo, useCallback } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  User,
  LogOut,
  Stethoscope,
  CalendarDays,
  Bell,
  HeartPulse,
  Star,
  Search,
  Settings,
  MapPin,
  CheckCircle,
  CalendarCheck,
  Clock,
  Video,
  X,
  AlertCircle,
  Clock3,
  Ban,
  ChevronRight,
  Filter,
  Loader2
} from 'lucide-react';
import Medecins from '../pages/medecins/Medecins';

// ============================================
// CONFIGURATION CENTRALISÉE
// ============================================
const APPOINTMENT_STATUS = {
  CONFIRMED: 'confirmé',
  PENDING: 'en attente',
  CANCELLED: 'annulé'
};

const STATUS_CONFIG = {
  [APPOINTMENT_STATUS.CONFIRMED]: {
    label: 'Confirmé',
    color: '#E6F9F9',
    textColor: '#0A8A78',
    borderColor: '#0A8A78',
    icon: CheckCircle
  },
  [APPOINTMENT_STATUS.PENDING]: {
    label: 'En attente',
    color: '#FFF4E0',
    textColor: '#B35D00',
    borderColor: '#B35D00',
    icon: Clock3
  },
  [APPOINTMENT_STATUS.CANCELLED]: {
    label: 'Annulé',
    color: '#FDEEEF',
    textColor: '#C21807',
    borderColor: '#C21807',
    icon: Ban
  }
};

const TYPE_CONFIG = {
  cabinet: { label: 'Au cabinet', icon: MapPin },
  vidéo: { label: 'En vidéo', icon: Video }
};

const FILTERS = [
  { id: 'all', label: 'Tous', status: null },
  { id: 'upcoming', label: 'À venir', status: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.PENDING] },
  { id: 'past', label: 'Passés', status: 'past' },
  { id: 'cancelled', label: 'Annulés', status: APPOINTMENT_STATUS.CANCELLED }
];

// ============================================
// MODAL DE CONFIRMATION (Annulation)
// ============================================
const CancelConfirmModal = ({ isOpen, appointment, onConfirm, onCancel, isLoading }) => {
  if (!isOpen || !appointment) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: 32,
        maxWidth: 420,
        width: '90%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        animation: 'slideUp 0.3s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#FDEEEF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <AlertCircle size={32} color='#C21807' />
          </div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
            Confirmer l'annulation
          </h3>
          <p style={{ margin: '12px 0 0 0', color: '#6B7280', lineHeight: 1.6 }}>
            Êtes-vous sûr de vouloir annuler votre rendez-vous avec{' '}
            <strong style={{ color: '#111827' }}>{appointment.doctor}</strong> ?
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: 14, color: '#9CA3AF' }}>
            {appointment.date} à {appointment.time}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px 20px',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              background: '#fff',
              color: '#374151',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            Retour
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px 20px',
              border: 'none',
              borderRadius: 12,
              background: '#C21807',
              color: '#fff',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: isLoading ? 0.8 : 1
            }}
          >
            {isLoading && <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />}
            {isLoading ? 'Annulation...' : 'Oui, annuler'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MODAL DE DÉTAILS
// ============================================
const AppointmentDetailsModal = ({ isOpen, appointment, onClose }) => {
  if (!isOpen || !appointment) return null;

  const statusConfig = STATUS_CONFIG[appointment.status];
  const typeConfig = TYPE_CONFIG[appointment.type] || TYPE_CONFIG.cabinet;
  const StatusIcon = statusConfig.icon;
  const TypeIcon = typeConfig.icon;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: 32,
        maxWidth: 480,
        width: '90%',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        animation: 'slideUp 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>
            Détails du rendez-vous
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: 8,
              border: 'none',
              background: 'transparent',
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X size={24} color='#6B7280' />
          </button>
        </div>

        {/* Médecin */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: 20,
          background: '#EAF7F4',
          borderRadius: 16,
          marginBottom: 20
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#2E8B7F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 24,
            fontWeight: 700
          }}>
            {appointment.doctor.charAt(3)}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>
              {appointment.doctor}
            </p>
            <p style={{ margin: '4px 0 0 0', color: '#2E8B7F', fontWeight: 600, fontSize: 16 }}>
              {appointment.specialty}
            </p>
          </div>
        </div>

        {/* Informations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InfoItem icon={Calendar} label="Date" value={appointment.date} />
            <InfoItem icon={Clock} label="Heure" value={appointment.time} />
          </div>
          <InfoItem 
            icon={TypeIcon} 
            label="Type de consultation" 
            value={typeConfig.label}
            subValue={appointment.location}
          />
          <InfoItem 
            icon={StatusIcon} 
            label="Statut" 
            value={statusConfig.label}
            isStatus={true}
            statusColor={statusConfig.textColor}
            statusBg={statusConfig.color}
          />
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 24,
            width: '100%',
            padding: '14px 20px',
            border: 'none',
            borderRadius: 12,
            background: '#2E8B7F',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(1.1)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'brightness(1)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

// Composant helper pour les infos
const InfoItem = ({ icon: Icon, label, value, subValue, isStatus, statusColor, statusBg }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    background: '#F9FAFB',
    borderRadius: 12
  }}>
    <Icon size={20} color='#9CA3AF' style={{ marginTop: 2 }} />
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </p>
      {isStatus ? (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          marginTop: 6,
          padding: '6px 12px',
          borderRadius: 20,
          background: statusBg,
          color: statusColor,
          fontWeight: 700,
          fontSize: 14
        }}>
          {value}
        </span>
      ) : (
        <>
          <p style={{ margin: '6px 0 0 0', fontWeight: 600, color: '#111827', fontSize: 16 }}>
            {value}
          </p>
          {subValue && (
            <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#6B7280' }}>
              {subValue}
            </p>
          )}
        </>
      )}
    </div>
  </div>
);

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
const EspacePatient = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // État des rendez-vous (simulation base de données)
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      doctor: 'Dr Sara Benali', 
      specialty: 'Dermatologue', 
      date: '15 Avril 2026', 
      time: '14:00', 
      status: APPOINTMENT_STATUS.CONFIRMED, 
      type: 'cabinet', 
      location: 'Casablanca',
      rawDate: '2026-04-15',
      createdAt: '2026-03-10'
    },
    { 
      id: 2, 
      doctor: 'Dr Ahmed El Idrissi', 
      specialty: 'Cardiologue', 
      date: '10 Avril 2026', 
      time: '10:30', 
      status: APPOINTMENT_STATUS.PENDING, 
      type: 'vidéo', 
      location: 'En ligne',
      rawDate: '2026-04-10',
      createdAt: '2026-03-15'
    },
    { 
      id: 3, 
      doctor: 'Dr Rania Haddad', 
      specialty: 'Gynécologue', 
      date: '05 Avril 2026', 
      time: '09:00', 
      status: APPOINTMENT_STATUS.CANCELLED, 
      type: 'cabinet', 
      location: 'Marrakech',
      rawDate: '2026-04-05',
      createdAt: '2026-03-01'
    },
    { 
      id: 4, 
      doctor: 'Dr Youssef Nabil', 
      specialty: 'Pédiatre', 
      date: '20 Avril 2026', 
      time: '16:00', 
      status: APPOINTMENT_STATUS.CONFIRMED, 
      type: 'cabinet', 
      location: 'Fès',
      rawDate: '2026-04-20',
      createdAt: '2026-03-20'
    },
    { 
      id: 5, 
      doctor: 'Dr Fatima Zahra', 
      specialty: 'Ophtalmologue', 
      date: '28 Mars 2026', 
      time: '11:00', 
      status: APPOINTMENT_STATUS.CONFIRMED, 
      type: 'cabinet', 
      location: 'Rabat',
      rawDate: '2026-03-28',
      createdAt: '2026-03-05'
    }
  ]);

  // État des filtres et modals
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const today = '2026-04-09';

  // ============================================
  // LOGIQUE DE FILTRAGE DYNAMIQUE (AJAX simulé)
  // ============================================
  const fetchFilteredAppointments = useCallback(async (filterId) => {
    setIsLoading(true);
    
    // Simulation d'appel AJAX avec délai
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setActiveFilter(filterId);
    setIsLoading(false);
  }, []);

  const filteredAppointments = useMemo(() => {
    const filter = FILTERS.find(f => f.id === activeFilter);
    
    return appointments.filter(apt => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'upcoming') {
        return filter.status.includes(apt.status) && apt.rawDate >= today;
      }
      if (activeFilter === 'past') {
        return apt.rawDate < today;
      }
      if (activeFilter === 'cancelled') {
        return apt.status === filter.status;
      }
      return true;
    }).sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
  }, [appointments, activeFilter, today]);

  // Compteurs dynamiques
  const getCount = useCallback((filterId) => {
    const filter = FILTERS.find(f => f.id === filterId);
    
    return appointments.filter(apt => {
      if (filterId === 'all') return true;
      if (filterId === 'upcoming') {
        return filter.status.includes(apt.status) && apt.rawDate >= today;
      }
      if (filterId === 'past') {
        return apt.rawDate < today;
      }
      if (filterId === 'cancelled') {
        return apt.status === filter.status;
      }
      return true;
    }).length;
  }, [appointments, today]);

  // ============================================
  // ACTIONS DYNAMIQUES
  // ============================================
  
  // Voir détails
  const handleViewDetails = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  }, []);

  // Ouvrir modal d'annulation
  const handleCancelClick = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  }, []);

  // Confirmer l'annulation (AJAX simulé)
  const handleConfirmCancel = useCallback(async () => {
    if (!selectedAppointment) return;

    setCancellingId(selectedAppointment.id);
    
    // Simulation appel API AJAX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mise à jour optimiste de l'état
    setAppointments(prev => prev.map(apt => 
      apt.id === selectedAppointment.id 
        ? { ...apt, status: APPOINTMENT_STATUS.CANCELLED }
        : apt
    ));
    
    setCancellingId(null);
    setIsCancelModalOpen(false);
    setSelectedAppointment(null);
  }, [selectedAppointment]);

  // Fermer modals
  const closeDetailsModal = useCallback(() => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedAppointment(null), 200);
  }, []);

  const closeCancelModal = useCallback(() => {
    if (cancellingId) return; // Empêcher la fermeture pendant le chargement
    setIsCancelModalOpen(false);
    setTimeout(() => setSelectedAppointment(null), 200);
  }, [cancellingId]);

  // ============================================
  // RENDU DES SECTIONS
  // ============================================
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medecins', label: 'Médecins', icon: Users },
    { id: 'rendez-vous', label: 'Mes Rendez-vous', icon: Calendar },
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];

  const doctors = [
    { id: 1, name: 'Dr Sara Benali', specialty: 'Dermatologue', location: 'Casablanca', rating: 4.8 },
    { id: 2, name: 'Dr Ahmed El Idrissi', specialty: 'Cardiologue', location: 'Rabat', rating: 4.9 },
    { id: 3, name: 'Dr Rania Haddad', specialty: 'Gynécologue', location: 'Marrakech', rating: 4.7 },
    { id: 4, name: 'Dr Youssef Nabil', specialty: 'Pédiatre', location: 'Fès', rating: 4.6 }
  ];

  const renderRendezVous = () => (
    <div style={{ padding: '30px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 8px 20px rgba(16, 24, 40, 0.08)' }}>
        
        {/* Header avec filtres dynamiques */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <h1 style={{ margin: 0, color: '#1C5E52', fontSize: 28, fontWeight: 700 }}>
                Mes Rendez-vous
              </h1>
              <p style={{ color: '#64748B', marginTop: 6, fontSize: 15 }}>
                {filteredAppointments.length} rendez-vous trouvé{filteredAppointments.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Filtres avec compteurs dynamiques */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              const count = getCount(f.id);
              
              return (
                <button
                  key={f.id}
                  onClick={() => fetchFilteredAppointments(f.id)}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 18px',
                    borderRadius: 12,
                    border: isActive ? 'none' : '1px solid #E5E7EB',
                    background: isActive ? '#2E8B7F' : '#fff',
                    color: isActive ? '#fff' : '#374151',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(46, 139, 127, 0.3)' : 'none',
                    opacity: isLoading && !isActive ? 0.6 : 1,
                    transform: isActive ? 'scale(1.02)' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && !isLoading) {
                      e.currentTarget.style.background = '#F9FAFB';
                      e.currentTarget.style.borderColor = '#D1D5DB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive && !isLoading) {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }
                  }}
                >
                  {f.label}
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 700,
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
                    color: isActive ? '#fff' : '#6B7280',
                    transition: 'all 0.2s'
                  }}>
                    {count}
                  </span>
                  {isLoading && isActive && (
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', marginLeft: 4 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* État de chargement */}
        {isLoading && (
          <div style={{ 
            textAlign: 'center', 
            padding: 40,
            color: '#6B7280'
          }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p>Chargement des rendez-vous...</p>
          </div>
        )}

        {/* Liste des rendez-vous */}
        {!isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredAppointments.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: 60, 
                background: '#F9FAFB',
                borderRadius: 16,
                border: '2px dashed #E5E7EB'
              }}>
                <Calendar size={48} color='#9CA3AF' style={{ margin: '0 auto 20px' }} />
                <h3 style={{ margin: 0, color: '#374151', fontSize: 18, fontWeight: 600 }}>
                  Aucun rendez-vous trouvé
                </h3>
                <p style={{ color: '#6B7280', marginTop: 8, maxWidth: 300, margin: '8px auto 0' }}>
                  Aucun rendez-vous ne correspond à ce filtre. Essayez un autre critère ou prenez un nouveau rendez-vous.
                </p>
                <button
                  onClick={() => fetchFilteredAppointments('all')}
                  style={{
                    marginTop: 24,
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: 12,
                    background: '#2E8B7F',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  Voir tous les rendez-vous
                </button>
              </div>
            ) : (
              filteredAppointments.map((ap) => {
                const statusConfig = STATUS_CONFIG[ap.status];
                const typeConfig = TYPE_CONFIG[ap.type] || TYPE_CONFIG.cabinet;
                const StatusIcon = statusConfig.icon;
                const TypeIcon = typeConfig.icon;
                const isProcessing = cancellingId === ap.id;

                return (
                  <div
                    key={ap.id}
                    style={{
                      background: '#F8FAFC',
                      borderRadius: 16,
                      padding: 24,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 20,
                      transition: 'all 0.3s ease',
                      border: '1px solid transparent',
                      opacity: isProcessing ? 0.7 : 1,
                      transform: isProcessing ? 'scale(0.98)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isProcessing) {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(16,24,40,0.12)';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {/* Informations principales */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 280 }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: ap.status === APPOINTMENT_STATUS.CANCELLED ? '#F3F4F6' : '#EAF7F4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        fontWeight: 700,
                        color: ap.status === APPOINTMENT_STATUS.CANCELLED ? '#9CA3AF' : '#2E8B7F',
                        flexShrink: 0
                      }}>
                        {ap.doctor.charAt(3)}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                          <h4 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0F172A' }}>
                            {ap.doctor}
                          </h4>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '5px 12px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 700,
                            background: statusConfig.color,
                            color: statusConfig.textColor,
                            border: `1px solid ${statusConfig.borderColor}20`
                          }}>
                            <StatusIcon size={13} />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p style={{ margin: 0, color: '#2E8B7F', fontWeight: 600, fontSize: 14 }}>
                          {ap.specialty}
                        </p>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 16, 
                          marginTop: 10,
                          flexWrap: 'wrap',
                          fontSize: 13,
                          color: '#64748B'
                        }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar size={15} />
                            {ap.date}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={15} />
                            {ap.time}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TypeIcon size={15} />
                            {typeConfig.label}
                          </span>
                          {ap.type === 'cabinet' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <MapPin size={15} />
                              {ap.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 10,
                      paddingLeft: 20,
                      borderLeft: '1px solid #E2E8F0'
                    }}>
                      <button
                        onClick={() => handleViewDetails(ap)}
                        disabled={isProcessing}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '10px 16px',
                          border: '1px solid #E5E7EB',
                          borderRadius: 10,
                          background: '#fff',
                          color: '#374151',
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: isProcessing ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          opacity: isProcessing ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isProcessing) {
                            e.currentTarget.style.background = '#F9FAFB';
                            e.currentTarget.style.borderColor = '#2E8B7F';
                            e.currentTarget.style.color = '#2E8B7F';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        Voir détails
                        <ChevronRight size={16} />
                      </button>
                      
                      {[APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.PENDING].includes(ap.status) && (
                        <button
                          onClick={() => handleCancelClick(ap)}
                          disabled={isProcessing}
                          style={{
                            padding: '10px 16px',
                            border: 'none',
                            borderRadius: 10,
                            background: isProcessing ? '#F3F4F6' : '#FDEEEF',
                            color: isProcessing ? '#9CA3AF' : '#C21807',
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            minWidth: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6
                          }}
                          onMouseEnter={(e) => {
                            if (!isProcessing) {
                              e.currentTarget.style.background = '#FDCFD4';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isProcessing) {
                              e.currentTarget.style.background = '#FDEEEF';
                              e.currentTarget.style.transform = 'none';
                            }
                          }}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                              ...
                            </>
                          ) : (
                            'Annuler'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AppointmentDetailsModal 
        isOpen={isDetailsOpen}
        appointment={selectedAppointment}
        onClose={closeDetailsModal}
      />

      <CancelConfirmModal
        isOpen={isCancelModalOpen}
        appointment={selectedAppointment}
        onConfirm={handleConfirmCancel}
        onCancel={closeCancelModal}
        isLoading={!!cancellingId}
      />
    </div>
  );

  // Autres sections (inchangées mais incluses pour complétude)
  const renderDashboard = () => (
    <div style={{ padding: '30px' }}>
      <h1 style={{ margin: 0, color: '#1C5E52', fontSize: 32, fontWeight: 700 }}>Bienvenue, {user?.nom || 'Patient'}</h1>
      <p style={{ color: '#5F6C7D', marginTop: 8 }}>Gérez vos rendez-vous facilement</p>

      <div style={{ marginTop: 20, borderRadius: 20, background: 'linear-gradient(135deg, #2E8B7F 0%, #3FAF9F 100%)', color: '#fff', padding: 24, boxShadow: '0 15px 30px rgba(0,0,0,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 26 }}>Bienvenue, {user?.nom || 'Patient'}</h2>
          <p style={{ marginTop: 10, lineHeight: 1.4 }}>Gérez vos rendez-vous facilement avec une interface claire et rapide.</p>
        </div>
        <HeartPulse size={46} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginTop: 22 }}>
        {[
          { title: 'Prochain Rendez-vous', value: '10 Avril 2026 • 10:30', subtitle: 'Consultation vidéo', icon: CalendarCheck },
          { title: 'Mes Rendez-vous', value: appointments.length.toString(), subtitle: `${appointments.filter(a => a.status !== APPOINTMENT_STATUS.CANCELLED).length} actifs`, icon: Calendar },
          { title: 'Notifications', value: '2 nouvelles', subtitle: 'Rappel de rendez-vous demain', icon: Bell }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 20px rgba(16, 24, 40, 0.08)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'default' }} onMouseEnter={(e) => Object.assign(e.currentTarget.style, { transform: 'translateY(-2px)', boxShadow: '0 12px 24px rgba(16,24,40,0.15)' })} onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: '0 8px 20px rgba(16,24,40,0.08)' })}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}><Icon size={22} color='#2E8B7F' style={{ marginRight: 10 }} /><p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>{card.title}</p></div>
              <h3 style={{ margin: 0, fontSize: 22, color: '#0F172A' }}>{card.value}</h3>
              {card.subtitle && <p style={{ marginTop: 6, color: '#64748B', fontSize: 14 }}>{card.subtitle}</p>}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <button onClick={() => setActiveTab('rendez-vous')} style={{ borderRadius: 12, border: 'none', background: '#2E8B7F', color: '#fff', padding: '12px 14px', fontWeight: 700, boxShadow: '0 6px 14px rgba(46, 139, 127, 0.35)', transition: 'transform .2s ease, filter .2s ease', cursor: 'pointer' }} onMouseEnter={(e) => Object.assign(e.currentTarget.style, { transform: 'scale(1.03)', filter: 'brightness(1.1)' })} onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'none', filter: 'brightness(1)' })}>Voir mes rendez-vous</button>
        <button onClick={() => setActiveTab('medecins')} style={{ borderRadius: 12, border: 'none', background: '#2E8B7F', color: '#fff', padding: '12px 14px', fontWeight: 700, boxShadow: '0 6px 14px rgba(46, 139, 127, 0.35)', transition: 'transform .2s ease, filter .2s ease', cursor: 'pointer' }} onMouseEnter={(e) => Object.assign(e.currentTarget.style, { transform: 'scale(1.03)', filter: 'brightness(1.1)' })} onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'none', filter: 'brightness(1)' })}>Prendre rendez-vous</button>
        <button onClick={() => setActiveTab('profil')} style={{ borderRadius: 12, border: 'none', background: '#2E8B7F', color: '#fff', padding: '12px 14px', fontWeight: 700, boxShadow: '0 6px 14px rgba(46, 139, 127, 0.35)', transition: 'transform .2s ease, filter .2s ease', cursor: 'pointer' }} onMouseEnter={(e) => Object.assign(e.currentTarget.style, { transform: 'scale(1.03)', filter: 'brightness(1.1)' })} onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'none', filter: 'brightness(1)' })}>Modifier profil</button>
      </div>

      <div style={{ marginTop: 24, background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 20px rgba(16, 24, 40, 0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#0F172A' }}>Médecins recommandés</h3>
          <button onClick={() => setActiveTab('medecins')} style={{ border: '1px solid #2E8B7F', background: 'white', color: '#2E8B7F', borderRadius: 10, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>Voir tous</button>
        </div>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {doctors.slice(0, 3).map((doc) => (
            <div key={doc.id} style={{ background: '#F9FAFB', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => Object.assign(e.currentTarget.style, { transform: 'scale(1.015)', boxShadow: '0 10px 20px rgba(16,24,40,0.15)' })} onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: 'none' })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EAF7F4', display: 'grid', placeItems: 'center' }}><User size={20} color='#2E8B7F' /></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{doc.name}</h4>
                  <p style={{ margin: '4px 0', color: '#64748B', fontSize: 14 }}>{doc.specialty}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>{doc.location}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {[1,2,3,4,5].map((star) => <Star key={star} size={14} fill={star <= Math.round(doc.rating) ? '#F59E0B' : 'transparent'} stroke='#F59E0B' />)}
                <span style={{ marginLeft: 6, color: '#334155', fontSize: 13 }}>{doc.rating}</span>
              </div>
              <button onClick={() => setActiveTab('medecins')} style={{ borderRadius: 10, border: 'none', background: '#2E8B7F', color: '#fff', padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>Prendre RDV</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMedecins = () => (
    <div style={{ padding: '30px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 20px rgba(16, 24, 40, 0.08)' }}>
        <h1 style={{ margin: 0, color: '#1C5E52', fontSize: 26 }}>Médecins Disponibles</h1>
        <p style={{ color: '#64748B', marginTop: 6 }}>Parcourez les professionnels et prenez rendez-vous instantanément.</p>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
          {doctors.map((doc) => (
            <div key={doc.id} style={{ background: '#F9FAFB', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => Object.assign(e.currentTarget.style, { transform: 'scale(1.01)', boxShadow: '0 10px 20px rgba(16,24,40,0.15)' })} onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: 'none' })}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EAF7F4', display: 'grid', placeItems: 'center' }}><User size={20} color='#2E8B7F' /></div>
                <div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{doc.name}</h4>
                  <p style={{ margin: 0, color: '#64748B', fontSize: 14 }}>{doc.specialty}</p>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B' }}>{doc.location}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {[1,2,3,4,5].map((star) => <Star key={star} size={14} fill={star <= Math.round(doc.rating) ? '#F59E0B' : 'transparent'} stroke='#F59E0B' />)}
                <span style={{ marginLeft: 6, color: '#334155', fontSize: 13 }}>{doc.rating}</span>
              </div>
              <button style={{ borderRadius: 10, border: 'none', background: '#2E8B7F', color: '#fff', padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>Prendre RDV</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfil = () => (
    <div style={{ padding: '30px' }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 20px rgba(16, 24, 40, 0.08)' }}>
        <h1 style={{ margin: 0, color: '#1C5E52', fontSize: 26 }}>Mon Profil</h1>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr', gap: 16, maxWidth: 520 }}>
          <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 14 }}><strong>Nom :</strong> {user?.nom || 'Non renseigné'}</div>
          <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 14 }}><strong>Email :</strong> {user?.email || 'Non renseigné'}</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'medecins': return <Medecins />;
      case 'rendez-vous': return renderRendezVous();
      case 'profil': return renderProfil();
      default: return renderDashboard();
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f9f8', fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif', color: '#1F2937' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      
      <header style={{ height: 70, backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', boxShadow: '0 2px 4px rgba(15, 23, 42, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>Bonjour, {user?.nom || 'Patient'} </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Bell size={20} color='#334155' style={{ cursor: 'pointer' }} />
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2E8B7F', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 700 }}>{user?.nom?.charAt(0) || 'P'}</div>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        <aside style={{ width: 260, background: '#fff', boxShadow: '2px 0 8px rgba(15, 23, 42, 0.08)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Stethoscope size={24} color='#2E8B7F' />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1F2937' }}>Cabinet Médical</h2>
          </div>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => handleMenuClick(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', marginBottom: 8, border: 'none', borderRadius: 12, background: isActive ? '#2E8B7F' : 'transparent', color: isActive ? '#fff' : '#334155', cursor: 'pointer', transition: 'background 0.2s ease, transform 0.2s ease' }} onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = '#e6f4f1')} onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = 'transparent')}>
                <Icon size={18} color={isActive ? '#fff' : '#2E8B7F'} />
                <span style={{ fontWeight: 600 }}>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <main style={{ flex: 1, overflowY: 'auto' }}>{renderContent()}</main>
      </div>
    </div>
  );
};

export default EspacePatient;