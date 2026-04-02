import React from 'react';
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Calendar, 
  FileText, 
  DollarSign,
  Brain, 
  ClipboardList, 
  UserCircle,
  Settings,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Banknote 
} from 'lucide-react'; 
import "./SideBar.css";

const SideBar = ({ active, isCollapsed, toggleCollapse }) => {
  return (
    <aside className={`sidebar ${active ? "active" : ""} ${isCollapsed ? "collapsed" : ""}`}>
      
      {/* Bouton pour réduire/agrandir la sidebar */}
      <button className="toggle-btn" onClick={toggleCollapse}>
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Header avec le Logo */}
      <div className="sidebar-header">
        <div className="brand-container">
          <div className="brand-icon-box">
            <Stethoscope size={24} color="#fff" strokeWidth={2.5} />
          </div>
          {!isCollapsed && (
            <div className="brand-text">
              <h1 className="brand-title">Cabinet Médical</h1>
              <span className="brand-subtitle">Management System</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Principal (Scrollable) */}
      <div className="sidebar-content">
        <ul className="nav-list">
          <NavItem to="/" icon={<LayoutDashboard size={22}/>} label="Tableau de bord" collapsed={isCollapsed} />
          <NavItem to="/patients" icon={<Users size={22}/>} label="Patients" collapsed={isCollapsed} />
          <NavItem to="/rendez-vous" icon={<CalendarDays size={22}/>} label="Rendez-vous" collapsed={isCollapsed} />
          <NavItem to="/calendrier" icon={<Calendar size={22}/>} label="Calendrier" collapsed={isCollapsed} />
          <NavItem to="/facturation" icon={<FileText size={22}/>} label="Facturation" collapsed={isCollapsed} />
<NavItem 
  to="/finances" 
  icon={<Banknote size={22} />} 
  label="Finances" 
  collapsed={isCollapsed} 
/>         {/* <NavItem to="/ia-prediction" icon={<Brain size={22}/>} label="IA Prédiction" collapsed={isCollapsed} /> */}
          <NavItem to="/dossier-medical" icon={<ClipboardList size={22}/>} label="Dossier Médical" collapsed={isCollapsed} />
        </ul>
      </div>

      {/* Pied de page FIXE avec Paramètres */}
      <div className="sidebar-footer">
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={22} className="nav-icon" />
          {!isCollapsed && <span>Profile</span>}
        </NavLink>
      </div>
    </aside>
  );
};

/* Petit composant utilitaire pour les liens du menu */
const NavItem = ({ to, icon, label, collapsed }) => (
  <li>
    <NavLink to={to} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
      <span className="nav-icon">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </NavLink>
  </li>
);

export default SideBar;