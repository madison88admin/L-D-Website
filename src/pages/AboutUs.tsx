function AboutUs() {
  return (
    <div className="home-page">
      <section className="home-about">
        <div className="section-inner about-grid">
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
            src="/images/madison88-logo-yellow.png"
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
    </div>
  );
}

export default AboutUs;
