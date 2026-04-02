import React from 'react'
import { Link } from 'react-router-dom'
import "./style/navbar.css"

function Navbar() {
  return (
    <nav className='navbar'>
      <div className="nav-container">
        {/* Update these to include the parent /vehicule prefix */}
        <Link to="/vehicule/add" className="nav-link first-link">
          Ajouter un Véhicule
        </Link>
        <Link to="/vehicule/vehicule" className="nav-link">
          Informations Véhicules
        </Link>
        <Link to="/vehicule/history" className="nav-link">
          Historique de Service
        </Link>
        <Link to="/vehicule/maintenance" className="nav-link">
          Maintenance
        </Link>
      </div>
    </nav>
  )
}

export default Navbar