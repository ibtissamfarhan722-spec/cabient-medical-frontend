import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SideBarSecretaire from "../layout/SideBar/SideBarSecretaire";
import Header from "../layout/Header/Header";
import Dashboard from "../pages/dashboard/dashboard";
import PatientManager from "../pages/patient/Patient";
import Facturation from "../pages/facturation/Facturation";
import RDV from "../pages/rendez-vous/RendezVous";
import Calendrier from "../pages/calendrier/Calendrier";


import "./EspaceSecretaire.css";

const EspaceSecretaire = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [factures, setFactures] = useState([
    { numFacture: "FAC-2026-001", Patient: "Sophie Martin", Date: "02 mars", Statut: "Payé", ttc: 65 },
  ]);

  return (
    <div className={`layout-wrapper ${isCollapsed ? "sidebar-is-small" : ""}`}>
      
      {/* 1. SIDEBAR */}
      <SideBarSecretaire 
        isCollapsed={isCollapsed} 
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      {/* 2. ZONE DE DROITE (Header + Pages) */}
      <div className="main-container">
        <Header 
          openSideBar={() => setIsMobileOpen(true)} 
          onLogout={onLogout} 
        />
        
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientManager />} />
            <Route path="/facturation" element={<Facturation />} />
            <Route path="/rendez-vous" element={<RDV />} />
            <Route path="/calendrier" element={<Calendrier />} />
            
            {/* Ajoutez vos autres routes ici */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default EspaceSecretaire;