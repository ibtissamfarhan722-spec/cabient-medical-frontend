import React from "react";
import { FaCarSide, FaCogs, FaWrench } from "react-icons/fa";
import { MdOutlineElectricalServices } from "react-icons/md";

const Services = () => {
  return (
    <div id="services" className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Nos Services</h2>
        <div className="row g-4">
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm py-2">
              <FaWrench style={{color: "#b8941f"}} className="display-3 w-100" />
              <div class="card-body text-center">
                <h5 class="card-title">Mécanique Générale</h5>
                <p class="card-text text-muted">Entretin, Videnge, freinage</p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm py-2">
              <FaCarSide style={{color: "#b8941f"}} className="display-3 w-100" />
              <div class="card-body text-center">
                <h5 class="card-title">Carrossrie & Peinture</h5>
                <p class="card-text text-muted">
                  Réperstion splis sinistre, peinture au four
                </p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm py-2">
              <MdOutlineElectricalServices style={{color: "#b8941f"}} className="display-3 w-100" />
              <div class="card-body text-center">
                <h5 class="card-title">Diagnostic Electreinque</h5>
                <p class="card-text text-muted">Reshharche de pannes valise</p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm py-2">
              <FaCogs style={{color: "#b8941f"}} className="display-3 w-100" />
              <div class="card-body text-center">
                <h5 class="card-title">Vente de Piéces</h5>
                <p class="card-text text-muted">Neuf et occasion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
