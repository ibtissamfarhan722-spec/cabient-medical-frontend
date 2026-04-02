import React from "react";

const Banner = () => {
  return (
    <div
      id="accueil"
      className="position-relative mt-5"
      style={{ height: "100vh" }}
    >
      <img
        src="images/banner.jpg"
        className="w-100"
        alt=""
        style={{ height: "100%" }}
      />
      <div
        className="position-absolute d-flex flex-column gap-2"
        style={{ top: "45%", left: "5%" }}
      >
        <h2 className="text-white display-4 font-bold">
          L'excellence méchanique <br /> à votre service
        </h2>
        <p className="text-white">
          Prenez soin de votre véhicule avec Garage Flow
        </p>
        <button className="btn-pri">Prendre un rendez-vous en ligne</button>
      </div>
    </div>
  );
};

export default Banner;
