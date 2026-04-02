import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "../layout/SideBar/SideBar";
import Header from "../layout/Header/Header";
import Dashboard from "../pages/dashboard/dashboard";
import SettingsPage from "../pages/Settings/Sittings";
import PatientManager from "../pages/patient/Patient";
import DossierMedical from "../pages/dossier-medical/DossierMedical";
import Facturation from "../pages/facturation/Facturation";
import RDV from "../pages/rendez-vous/RendezVous";
import Calendrier from "../pages/calendrier/Calendrier";
import Medecins from '../pages/medecins/Medecins';

import "./EspaceMedecin.css";

const EspaceMedecin = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [factures, setFactures] = useState([
    { numFacture: "FAC-2026-001", Patient: "Sophie Martin", Date: "02 mars", Statut: "Payé", ttc: 65 },
  ]);

  return (
    <div className={`layout-wrapper ${isCollapsed ? "sidebar-is-small" : ""}`}>
      
      {/* 1. SIDEBAR */}
      <SideBar 
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
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/dossier-medical" element={<DossierMedical />} />
            <Route path="/facturation" element={<Facturation />} />
            <Route path="/rendez-vous" element={<RDV />} />
            <Route path="/calendrier" element={<Calendrier />} />
            <Route path="/medecins" element={<Medecins />} />
        

            {/* Ajoutez vos autres routes ici */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default EspaceMedecin;