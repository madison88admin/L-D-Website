const hrMembers = [
  { name: 'Lily', role: 'HR Member', initials: 'LI' },
  { name: 'Weng', role: 'HR Member', initials: 'WE' },
  { name: 'Laurence', role: 'HR Member', initials: 'LA' },
  { name: 'Sheen', role: 'HR Member', initials: 'SH' },
  { name: 'Diane', role: 'HR Member', initials: 'DI' },
];

const contributors = [
  { name: 'Paul', role: 'IT & AI', initials: 'PA' },
  { name: 'Edwin', role: 'Process Improvement', initials: 'ED' },
  { name: 'Lindsey', role: 'Production', initials: 'LI' },
  { name: 'Kendall', role: 'Product & Business Dev.', initials: 'KE' },
  { name: 'Polly', role: 'Global Ops', initials: 'PO' },
  { name: 'James', role: 'Leadership', initials: 'JA' },
  { name: 'CC', role: 'Financial Systems', initials: 'CC' },
  { name: 'Eric', role: 'Manuf. & QA', initials: 'ER' },
  { name: 'CA', role: 'Administration', initials: 'CA' },
];
 
function Home() {
  return (
    <div className="home-page">
      <section className="home-hero" aria-label="Madison88 Learning and Development">
        <video
          className="hero-background-video"
          src="/videos/hero-background.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="hero-content">
          <img
            className="hero-logo"
            src="/images/madison88-logo-yellow.png"
            alt="Madison88"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
          <h1>
            Learning &amp;
            <span>Organizational Development</span>
          </h1>
          <p>Upskill. Excel. Succeed.</p>
        </div>
      </section>

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

      <section className="specialists-section">
        <div className="section-inner">
          <div className="specialists-heading">
            <p className="section-kicker">Specialist Profile</p>
            <h2>L&amp;D Specialist Profile</h2>
            <p>
              A cross-functional learning group supporting programs, operations,
              systems, and team capability across Madison88.
            </p>
          </div>

          <div className="profile-layout">
            <article className="specialist-card profile-card">
              <div className="specialist-photo profile-photo">
                <span>CH</span>
              </div>
              <p className="profile-role">L&amp;D Specialist</p>
              <h3>Chai</h3>
              <p>
                Leads learning coordination, program support, and development
                initiatives for the Global HR &amp; Admin group.
              </p>
              <a className="profile-contact" href="mailto:?subject=Learning%20%26%20Development%20Inquiry">
                Contact Me
              </a>
            </article>

            <article className="specialist-card hr-members-card">
              <p className="profile-role">HR Members</p>
              <h3>HR Partners</h3>
              <div className="hr-member-list">
                {hrMembers.map((member) => (
                  <article className="contributor-profile" key={member.name}>
                    <div className="contributor-photo">
                      <span>{member.initials}</span>
                    </div>
                    <div>
                      <h4>{member.name}</h4>
                      <p>{member.role}</p>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="specialist-card contributors-card">
              <p className="profile-role">Contributors</p>
              <h3>Program Contributors</h3>
              <div className="contributors-list">
                {contributors.map((contributor) => (
                  <article className="contributor-profile" key={contributor.name}>
                    <div className="contributor-photo">
                      <span>{contributor.initials}</span>
                    </div>
                    <div>
                      <h4>{contributor.name}</h4>
                      <p>{contributor.role}</p>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
