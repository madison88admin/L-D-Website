import type { CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProgramBySlug } from '../data/programs';

type ProgramDetailStyle = CSSProperties & {
  '--program-accent': string;
};

function ProgramDetail() {
  const { slug } = useParams();
  const program = getProgramBySlug(slug);

  if (!program) {
    return <Navigate to="/programs" replace />;
  }

  return (
    <section className="program-detail-page">
      <Link className="back-link" to="/programs">
        Back to Programs
      </Link>
      <div className="program-detail-card" style={{ '--program-accent': program.accent } as ProgramDetailStyle}>
        <span className="program-card-mark" aria-hidden="true"></span>
        <p className="section-kicker">Program</p>
        <h1>{program.title}</h1>
        <p>{program.summary}</p>
      </div>
    </section>
  );
}

export default ProgramDetail;
