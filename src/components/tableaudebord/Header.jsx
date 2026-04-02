const Header = () => {
  return (
    <section className="dashboard-card">
      <div className="dashboard-header">
        <div className="dashboard-text">
          <h2 className="dashboard-title">Bonjour, Dr. Martin</h2>
          <p className="dashboard-subtitle">
            Vous avez <span className="highlight">8 rendez-vous</span>{" "}
            aujourd'hui
          </p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-box">
            <p className="stat-number">8</p>
            <span className="stat-label">Aujourd'hui</span>
          </div>

          <div className="stat-box">
            <p className="stat-number">3</p>
            <span className="stat-label">En attente</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
