function Home() {
  return (
    <div className="home-page">
      <section className="home-hero" aria-label="Madison88 Learning and Development">
        <div className="hero-content">
          <img
            className="hero-logo"
            src="/images/madison88-logo-white.png"
            alt="Madison88"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <h1>
            LEARNING &amp;
            <span>DEVELOPMENT</span>
          </h1>
          <p>Upskill. Excel. Succeed.</p>
        </div>
      </section>

      <section className="home-about">
        <div className="section-inner about-grid">
          <img
            className="section-logo"
            src="/images/madison88-logo-blue.png"
            alt="Madison88"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />

          <div className="about-image-card" aria-label="Madison88 learning session"></div>

          <div className="about-copy">
            <h2>We are Madison 88.</h2>
            <p>
              Madison88 Learning & Development helps professionals and teams
              build practical skills for modern work. Through focused programs,
              thoughtful facilitation, and a commitment to measurable growth, we
              support learners as they upskill, excel, and succeed.
            </p>
          </div>
        </div>
      </section>

      <section className="excellence-section">
        <div className="section-inner excellence-content">
          <img
            className="excellence-logo"
            src="/images/madison88-logo-white.png"
            alt="Madison88"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <h2>Madison 88 Center for Excellence</h2>
          <p>
            Our mission is to create learning experiences that sharpen
            capability, strengthen confidence, and prepare individuals and
            organizations for sustained success.
          </p>
        </div>
      </section>

      <section className="specialists-section">
        <div className="section-inner">
          <div className="specialists-heading">
            <p className="section-kicker">Specialists</p>
            <h2>Meet Our Learning Specialists</h2>
          </div>

          <div className="specialist-grid">
            <article className="specialist-card">
              <div className="specialist-photo"></div>
              <h3>Leadership Coach</h3>
              <p>Placeholder profile for leadership and management programs.</p>
            </article>
            <article className="specialist-card">
              <div className="specialist-photo"></div>
              <h3>Program Facilitator</h3>
              <p>Placeholder profile for workshop design and delivery.</p>
            </article>
            <article className="specialist-card">
              <div className="specialist-photo"></div>
              <h3>Learning Strategist</h3>
              <p>Placeholder profile for capability building and assessment.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
