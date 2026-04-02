import { useEffect, useState } from "react";
import { Link } from "react-scroll";

const Navbar = () => {
  const [numScroll, setNumScroll] = useState(0);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      setNumScroll(window.scrollY);
    });
  }, [numScroll]);
  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top bg-white py-1 ${
        numScroll > 0 && "shadow-sm"
      }`}
    >
      <div className="container py-1">
        <img
          src="images/logo.png"
          className="navbar-brand"
          style={{ width: "100px", height: "100px" }}
          alt=""
        />
        <button
          className="navbar-toggler shadow-none border-0"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="sidebar offcanvas offcanvas-start"
          tabindex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <img
              src="images/logo.png"
              className="navbar-brand"
              style={{ width: "100px" }}
              alt=""
            />
            <button
              type="button"
              className="btn-close shadow-none"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body d-flex flex-column flex-lg-row p-4 p-lg-0">
            <ul className="navbar-nav justify-content-center align-items-center flex-grow-1 pe-3">
              <li className="fs-5 nav-item mx-2">
                <Link
                  to="accueil"
                  smooth={true}
                  spy={true}
                  duration={300}
                  className={`nav-link mx-lg-2`}
                  aria-current="page"
                  activeClass="activee"
                >
                  Accueil
                </Link>
              </li>
              <li className="fs-5 nav-item mx-2">
                <Link
                  to="services"
                  smooth={true}
                  spy={true}
                  duration={300}
                  className={`nav-link mx-lg-2`}
                  aria-current="page"
                  activeClass="activee"
                >
                  Services
                </Link>
              </li>
              <li className="fs-5 nav-item mx-2">
                <Link
                  to="contact"
                  smooth={true}
                  spy={true}
                  duration={300}
                  className={`nav-link mx-lg-2`}
                  aria-current="page"
                  activeClass="activee"
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-3">
              <button className="btn-pri">Connextion</button>
              <button className="btn-secondary">Créer un compte</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
