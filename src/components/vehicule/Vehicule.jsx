import React from 'react'
import { useSelector } from 'react-redux'
import VehiculeList from './VehiculeList'
import "./style/vehicule.css"
function Vehicule() {
    let Vehicules = useSelector(state => state.Vehicules.list)
    
    return (
        <div className='Vehicule'>
           
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Immatriculation</th>
                            <th>Marque</th>
                            <th>Modèle</th>
                            <th>Année</th>
                            <th>Kilométrage</th>
                            <th>ID Client</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Vehicules.map((Vehicule, index) => (
                            <VehiculeList key={index} Vehicule={Vehicule} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Vehicule