import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

const Contact = () => {
  return (
    <section
      id="contact"
      className="py-5"
      style={{ backgroundColor: "#0d1321", color: "#fff" }}
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6">
            <h2>Contactez-nous</h2>
            <div className="d-flex align-items-start mt-5">
              <div
                style={{ background: "#d4af37" }}
                className="text-white p-3 rounded me-3 fs-4"
              >
                <FiMapPin />
              </div>
              <div>
                <strong>Adresse</strong>
                <p>
                  123 Avenue des Garages
                  <br />
                  75001 Paris, France
                </p>
              </div>
            </div>
            <div className="d-flex align-items-start mt-3">
              <div
                style={{ background: "#d4af37" }}
                className="text-white p-3 rounded me-3 fs-4"
              >
                <FiPhone />
              </div>
              <div>
                <strong>Téléphone</strong>
                <p>01 23 45 67 89</p>
              </div>
            </div>
            <div className="d-flex align-items-start mt-3">
              <div
                style={{ background: "#d4af37" }}
                className="text-white p-3 rounded me-3 fs-4"
              >
                <FiMail />
              </div>
              <div>
                <strong>Email</strong>
                <p>contact@garageflow.fr</p>
              </div>
            </div>
            <div className="d-flex align-items-start mt-3">
              <div
                style={{ background: "#d4af37" }}
                className="text-white p-3 rounded me-3 fs-4"
              >
                <FiClock />
              </div>
              <div>
                <strong>Horaires d'ouverture</strong>
                <p>
                  Lundi - Vendredi : 8h00 - 18h00
                  <br />
                  Samedi : 9h00 - 13h00
                  <br />
                  Dimanche : Fermé
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="rounded overflow-hidden shadow"
              style={{ height: "100%" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999404037373!2d2.293798515674366!3d48.857480079287315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fcb1f4e927d%3A0x8fa9e2c7c0e4d1e6!2s123%20Avenue%20des%20Garages%2C%2075001%20Paris%2C%20France!5e0!3m2!1sfr!2sus!4v1690000000000!5m2!1sfr!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
