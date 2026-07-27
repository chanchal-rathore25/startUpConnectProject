const Hero = ({ startup }) => {
  const stageShort = startup.stage?.split(" ")[0] || "";

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="brand-row">
          <div className="logo" >{startup.logoInitials || startup.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="brand-name">{startup.name}</div>
            <div className="brand-industry">{startup.industry}</div>
          </div>
        </div>

        <div className="chip-row">
          <span className="chip">📍 {startup.location}</span>
          <span className="chip stage">⭐ {startup.stage}</span>
          <span className="chip">💰 {startup.fundingNeeded} Needed</span>
        </div>

        <div className="vitals">
          <svg className="vitals-line" viewBox="0 0 700 52" preserveAspectRatio="none">
            <path d="M0,26 L120,26 L145,8 L165,44 L190,26 L260,26 L280,14 L300,38 L320,26 L700,26" />
          </svg>
          <div className="stat-grid">
            <div className="stat" style={{ animationDelay: "1.4s" }}>
              <div className="stat-value">{startup.fundingNeeded}</div>
              <div className="stat-label">Funding Needed</div>
            </div>
            <div className="stat" style={{ animationDelay: "1.55s" }}>
              <div className="stat-value">{startup.teamSize}</div>
              <div className="stat-label">Team Members</div>
            </div>
            <div className="stat" style={{ animationDelay: "1.7s" }}>
              <div className="stat-value">{stageShort}</div>
              <div className="stat-label">Stage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
