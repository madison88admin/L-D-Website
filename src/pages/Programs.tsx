import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { programs } from '../data/programs';

type ProgramCardStyle = CSSProperties & {
  '--program-accent': string;
};

function Programs() {
  return (
    <section className="programs-page">
      <aside className="programs-panel">
        <div>
          <p className="programs-kicker">Madison88</p>
          <h1>Programs Offered.</h1>
        </div>
        <p>
          Practical learning tracks designed to help individuals and teams build
          capability, confidence, and excellence at work.
        </p>
      </aside>

      <div className="programs-content">
        <div className="programs-heading">
          <p className="section-kicker">Learning Tracks</p>
          <h2>Programs Offered.</h2>
        </div>

        <div className="program-card-grid">
          {programs.map((program) => (
            <Link
              className="program-card"
              key={program.slug}
              style={{ '--program-accent': program.accent } as ProgramCardStyle}
              to={`/programs/${program.slug}`}
            >
              <span className="program-card-mark" aria-hidden="true"></span>
              <h3>{program.title}</h3>
              <p>{program.summary}</p>
              <span className="program-card-action">View program</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Programs;
