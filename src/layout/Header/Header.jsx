import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, ChevronDown, Sun, Moon, Menu, LogOut } from 'lucide-react';
import './Header.css';

const Header = ({ openSideBar, onLogout }) => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "sun");
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);

    // 1. Déterminer le titre de la page dynamiquement selon l'URL
    const getPageTitle = () => {
        const path = location.pathname;
        switch (path) {
            case '/': return "Tableau de bord";
            case '/patients': return "Patients";
            case '/rendez-vous': return "Rendez-vous";
            case '/calendrier': return "Calendrier";
            case '/facturation': return "Facturation";
            case '/ia-prediction': return "IA Prédiction";
            case '/dossier-medical': return "Dossier Médical";
            case '/settings': return "Paramètres";
            default: return "Cabinet Médical";
        }
    };

    // 2. Charger l'utilisateur et gérer le clic extérieur pour fermer le menu
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const themeSwitch = () => {
        const newTheme = theme === "sun" ? "moon" : "sun";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.body.classList.toggle("dark");
    };

    const getCurrentDate = () => {
        return new Intl.DateTimeFormat('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date());
    };

    return (
        <header className="main-header">
            <div className="header-left">
                <button className="mobile-menu-btn" onClick={openSideBar}>
                    <Menu size={24} />
                </button>
                <div className="page-heading">
                    <h2 className="page-title">{getPageTitle()}</h2>
                    <p className="current-date">{getCurrentDate()}</p>
                </div>
            </div>

            <div className="header-right">
                <div className="action-buttons">
                    <button className="theme-toggle" onClick={themeSwitch}>
                        {theme === 'sun' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    
                    <div className="notification-wrapper">
                        <button className="icon-btn">
                            <Bell size={22} color="#64748b" />
                            <span className="dot-badge"></span>
                        </button>
                    </div>
                </div>

                {/* PROFIL AVEC MENU DÉROULANT */}
                <div className="user-profile-section" ref={dropdownRef}>
                    <div className="user-avatar-circle">
                        <span>{user ? (user.first_name?.charAt(0) + user.last_name?.charAt(0)) : "DM"}</span>
                    </div>
                    
                    <div className="user-details" onClick={() => setIsDropdownOpen(!isDropdownOpen)} style={{cursor: 'pointer'}}>
                        <span className="user-full-name">
                            {user ? `Dr. ${user.last_name}` : "Dr. Martin"}
                        </span>
                        <span className="user-occupation">
                            {user?.role === 'admin' ? 'Administrateur' : 'Médecin'}
                        </span>
                    </div>
                    
                    <button className={`dropdown-trigger ${isDropdownOpen ? 'open' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <ChevronDown size={18} color="#94a3b8" />
                    </button>

                    {/* BULLE DE DÉCONNEXION (Dropdown) */}
                    {isDropdownOpen && (
                        <div className="logout-dropdown">
                            <button className="logout-item" onClick={onLogout}>
                                <LogOut size={18} className="logout-icon" />
                                <span>Se déconnecter</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;