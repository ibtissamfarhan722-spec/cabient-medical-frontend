import React from "react";
import { FaAward, FaBolt, FaEye } from "react-icons/fa";

const Choisir = () => {
  return (
    <div className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Pourquoi Nous Choisir ?</h2>
        <div className="d-flex flex-lg-row flex-column justify-content-center gap-5">
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div
              class="card h-100 shadow-sm py-2 border-0"
              style={{ backgroundColor: "#d4af37" }}
            >
              <FaAward className="display-3 w-100" />
              <div class="card-body text-center">
                <h5 class="card-title text-white">Expertise certifiée</h5>
                <p class="card-text text-muted">Techniciens certifiés</p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div
              class="card h-100 shadow-sm py-2 border-0"
              style={{ backgroundColor: "#d4af37" }}
            >
              <FaEye className="display-3 w-100" />
              <div class="card-body text-center">
                <h5 class="card-title text-white">Transparence des devis</h5>
                <p class="card-text text-muted">Devis clairs avtns travaxs</p>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div
              class="card h-100 shadow-sm py-2 border-0"
              style={{ backgroundColor: "#d4af37" }}
            >
              <FaBolt className="display-3 w-100" />
              <div class="card-body text-center">
                <h5 class="card-title text-white">Repidité</h5>
                <p class="card-text text-muted">Prise charge sans attente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choisir;
