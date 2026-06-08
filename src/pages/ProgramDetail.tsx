import type { CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProgramBySlug, programs, type Program, type ProgramTextAlign } from '../data/programs';

type DetailTextStyle = CSSProperties & {
  textAlign: ProgramTextAlign;
};

const programsStorageKey = 'madison88-program-content';

function loadPrograms() {
  if (typeof window === 'undefined') {
    return programs;
  }

  const savedPrograms = window.localStorage.getItem(programsStorageKey);

  if (!savedPrograms) {
    return programs;
  }

  try {
    const parsedPrograms = JSON.parse(savedPrograms) as Program[];
    const savedSlugs = new Set(parsedPrograms.map((program) => program.slug));
    const mergedPrograms = programs.filter((program) => savedSlugs.has(program.slug)).map((program) => {
      const savedProgram = parsedPrograms.find((item) => item.slug === program.slug);
      const mergedProgram = {
        ...program,
        ...savedProgram,
        detail: {
          ...program.detail,
          ...savedProgram?.detail,
        },
      };

      if (program.slug === 'communication' && savedProgram?.title === 'Communication') {
        mergedProgram.title = program.title;
      }

      if (
        program.slug === 'problem-solving-critical-thinking' &&
        savedProgram?.title === 'Problem-solving & Critical Thinking'
      ) {
        mergedProgram.title = program.title;
      }

      return mergedProgram;
    });
    const addedPrograms = parsedPrograms.filter(
      (savedProgram) => !programs.some((program) => program.slug === savedProgram.slug),
    );

    return [...mergedPrograms, ...addedPrograms];
  } catch {
    return programs;
  }
}

function ProgramDetail() {
  const { slug } = useParams();
  const defaultProgram = getProgramBySlug(slug);
  const program = loadPrograms().find((item) => item.slug === slug) || defaultProgram;

  if (!program) {
    return <Navigate to="/programs" replace />;
  }

  const detailTextStyle: DetailTextStyle = {
    color: program.detail.textColor,
    fontSize: `clamp(1.15rem, ${program.detail.textSize}, 2rem)`,
    fontWeight: program.detail.isBold ? 800 : 400,
    paddingLeft: program.detail.isIndented ? '42px' : undefined,
    textAlign: program.detail.alignment,
  };

  return (
    <section className="program-detail-page">
      <div className="program-detail-menu">
        <Link to="/programs" aria-label="Back to programs">
          <span aria-hidden="true">‹</span>
        </Link>
        <span>Menu</span>
      </div>

      <img
        className="program-detail-logo"
        src="/images/madison88-logo-blue.png"
        alt="Madison88"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />

      <div className="program-detail-title">
        <h1>{program.detail.heading}</h1>
        <p>{program.detail.subheading}</p>
      </div>

      {program.detail.useDetail ? (
        <div className="program-detail-topics">
          <h2>{program.detail.title}</h2>
          {program.detail.subtitle && <p className="program-detail-subtitle">{program.detail.subtitle}</p>}
          <div className="program-detail-text" style={detailTextStyle}>
            {program.detail.text.split('\n').map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      ) : (
        <div className="program-detail-topics">
          <h2>{program.title}</h2>
          <p className="program-detail-fallback">{program.summary}</p>
        </div>
      )}
    </section>
  );
}

export default ProgramDetail;
