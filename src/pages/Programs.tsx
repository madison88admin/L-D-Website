import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  programs,
  type Program,
  type ProgramDetailContent,
  type ProgramTextAlign,
} from '../data/programs';

const programsStorageKey = 'madison88-program-content';
const adminUsername = 'hr-admin';
const adminPassword = 'change-this-password';

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

function savePrograms(content: Program[]) {
  window.localStorage.setItem(programsStorageKey, JSON.stringify(content));
}

function resizeImageForStorage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Unable to read image file.'));
        return;
      }

      image.src = reader.result;
    };

    reader.onerror = () => {
      reject(new Error('Unable to read image file.'));
    };

    image.onload = () => {
      const maxSize = 900;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Unable to prepare image.'));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.84));
    };

    image.onerror = () => {
      reject(new Error('Unable to load image file.'));
    };

    reader.readAsDataURL(file);
  });
}

function slugifyTitle(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'new-program'
  );
}

function getUniqueSlug(title: string, currentPrograms: Program[]) {
  const baseSlug = slugifyTitle(title);
  let slug = baseSlug;
  let count = 2;

  while (currentPrograms.some((program) => program.slug === slug)) {
    slug = `${baseSlug}-${count}`;
    count += 1;
  }

  return slug;
}

function getNewProgramDetail(title: string): ProgramDetailContent {
  return {
    heading: title,
    subheading: 'Program',
    title: 'Topics:',
    subtitle: '',
    text: 'Add program details here.',
    useDetail: true,
    textColor: '#173c63',
    textSize: '2rem',
    isBold: false,
    isIndented: false,
    alignment: 'left',
  };
}

function Programs() {
  const [programContent, setProgramContent] = useState(loadPrograms);
  const [draftProgramContent, setDraftProgramContent] = useState(programContent);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [saveError, setSaveError] = useState('');

  const openAdmin = () => {
    setDraftProgramContent(programContent);
    setIsAdminOpen(true);
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loginForm.username === adminUsername && loginForm.password === adminPassword) {
      setIsLoggedIn(true);
      setLoginError('');
      return;
    }

    setLoginError('Invalid admin login.');
  };

  const updateProgram = (slug: string, field: keyof Program, value: string) => {
    setDraftProgramContent((content) =>
      content.map((program) => (program.slug === slug ? { ...program, [field]: value } : program)),
    );
  };

  const updateProgramDetail = (
    slug: string,
    field: keyof ProgramDetailContent,
    value: string | boolean,
  ) => {
    setDraftProgramContent((content) =>
      content.map((program) =>
        program.slug === slug
          ? {
              ...program,
              detail: {
                ...program.detail,
                [field]: value,
              },
            }
          : program,
      ),
    );
  };

  const addProgram = () => {
    setDraftProgramContent((content) => {
      const title = 'New Program';
      const newProgram: Program = {
        slug: getUniqueSlug(title, content),
        title,
        summary: 'Add a short program summary.',
        accent: '#69aee7',
        image: '',
        detail: getNewProgramDetail(title),
      };

      return [...content, newProgram];
    });
  };

  const deleteProgram = (slug: string) => {
    setDraftProgramContent((content) => content.filter((program) => program.slug !== slug));
  };

  const deleteProgramImage = (slug: string) => {
    setDraftProgramContent((content) =>
      content.map((program) => (program.slug === slug ? { ...program, image: '' } : program)),
    );
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>, slug: string) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const resizedImage = await resizeImageForStorage(file);
      const nextDraftContent = draftProgramContent.map((program) =>
        program.slug === slug ? { ...program, image: resizedImage } : program,
      );
      const nextProgramContent = programContent.map((program) =>
        program.slug === slug ? { ...program, image: resizedImage } : program,
      );

      setDraftProgramContent(nextDraftContent);
      setProgramContent(nextProgramContent);
      savePrograms(nextProgramContent);
      setSaveError('');
    } catch {
      setSaveError('Image upload failed. Please try a different image.');
    }
  };

  const handleSave = () => {
    try {
      savePrograms(draftProgramContent);
      setProgramContent(draftProgramContent);
      setSaveError('');
      setIsAdminOpen(false);
    } catch {
      setSaveError('Save failed. Try using smaller photos.');
    }
  };

  return (
    <section className="programs-page">
      <div className="programs-blue-field">
        <h1
          onClick={(event) => {
            if (event.detail === 3) {
              openAdmin();
            }
          }}
        >
          Programs Offered
        </h1>
      </div>

      <div className="programs-card-grid">
        {programContent.map((program) => (
          <Link className="program-image-card" key={program.slug} to={`/programs/${program.slug}`}>
            {program.image && (
              <img
                key={program.image}
                src={program.image}
                alt={program.title}
                onLoad={(event) => {
                  event.currentTarget.style.display = 'block';
                }}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span>{program.title}</span>
          </Link>
        ))}
      </div>

      {isAdminOpen && (
        <div className="hr-admin-overlay" role="dialog" aria-modal="true" aria-label="Programs admin">
          <div className="hr-admin-modal">
            <div className="hr-admin-header">
              <div>
                <p className="section-kicker">Programs Admin</p>
                <h2>{isLoggedIn ? 'Edit Program Cards' : 'Admin Login'}</h2>
              </div>
              <button
                className="hr-admin-close"
                type="button"
                onClick={() => {
                  setIsAdminOpen(false);
                  setLoginError('');
                  setSaveError('');
                }}
                aria-label="Close programs admin"
              >
                x
              </button>
            </div>

            {!isLoggedIn ? (
              <form className="hr-admin-login" onSubmit={handleLogin}>
                <label>
                  Username
                  <input
                    value={loginForm.username}
                    onChange={(event) => {
                      setLoginForm((form) => ({ ...form, username: event.target.value }));
                    }}
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => {
                      setLoginForm((form) => ({ ...form, password: event.target.value }));
                    }}
                  />
                </label>
                {loginError && <p className="hr-admin-error">{loginError}</p>}
                <button className="hr-admin-primary" type="submit">
                  Login
                </button>
              </form>
            ) : (
              <div className="hr-admin-editor">
                <section className="hr-admin-editor-section">
                  <div className="hr-admin-section-heading">
                    <h3>Program Cards</h3>
                    <button className="hr-admin-small-action" type="button" onClick={addProgram}>
                      Add Card
                    </button>
                  </div>
                  {draftProgramContent.map((program) => (
                    <div className="program-admin-card-block" key={program.slug}>
                      <div className="program-admin-card-row">
                        <div className="program-admin-preview">
                          {program.image && (
                            <img
                              key={program.image}
                              src={program.image}
                              alt={program.title}
                              onLoad={(event) => {
                                event.currentTarget.style.display = 'block';
                              }}
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <span>{program.title.charAt(0)}</span>
                        </div>
                        <div className="program-admin-photo-actions">
                          <label>
                            Photo
                            <input
                              id={`program-photo-${program.slug}`}
                              className="hr-admin-file-input"
                              type="file"
                              accept="image/*"
                              onChange={(event) => {
                                handleImageUpload(event, program.slug);
                              }}
                            />
                            <span className="hr-admin-file-button">Choose File</span>
                          </label>
                          <button
                            className="program-admin-danger"
                            type="button"
                            onClick={() => {
                              deleteProgramImage(program.slug);
                            }}
                          >
                            Delete Image
                          </button>
                        </div>
                        <label>
                          Title
                          <input
                            maxLength={60}
                            value={program.title}
                            onChange={(event) => {
                              updateProgram(program.slug, 'title', event.target.value);
                            }}
                          />
                        </label>
                        <button
                          className="program-admin-danger"
                          type="button"
                          onClick={() => {
                            deleteProgram(program.slug);
                          }}
                        >
                          Delete Card
                        </button>
                      </div>

                      <details className="program-admin-detail-dropdown">
                        <summary>Paragraph Page Editor</summary>
                        <div className="program-admin-editor-toolbar" aria-label="Text controls">
                          <label>
                            Size
                            <input
                              value={program.detail.textSize}
                              placeholder="2rem"
                              onChange={(event) => {
                                updateProgramDetail(program.slug, 'textSize', event.target.value);
                              }}
                            />
                          </label>
                          <label>
                            Alignment
                            <select
                              value={program.detail.alignment}
                              onChange={(event) => {
                                updateProgramDetail(
                                  program.slug,
                                  'alignment',
                                  event.target.value as ProgramTextAlign,
                                );
                              }}
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                              <option value="justify">Justify</option>
                            </select>
                          </label>
                          <label>
                            Color
                            <input
                              type="color"
                              value={program.detail.textColor}
                              onChange={(event) => {
                                updateProgramDetail(program.slug, 'textColor', event.target.value);
                              }}
                            />
                          </label>
                          <label className="program-admin-check">
                            <input
                              type="checkbox"
                              checked={program.detail.isBold}
                              onChange={(event) => {
                                updateProgramDetail(program.slug, 'isBold', event.target.checked);
                              }}
                            />
                            Bold
                          </label>
                          <label className="program-admin-check">
                            <input
                              type="checkbox"
                              checked={program.detail.isIndented}
                              onChange={(event) => {
                                updateProgramDetail(
                                  program.slug,
                                  'isIndented',
                                  event.target.checked,
                                );
                              }}
                            />
                            Indent
                          </label>
                          <label className="program-admin-check">
                            <input
                              type="checkbox"
                              checked={program.detail.useDetail}
                              onChange={(event) => {
                                updateProgramDetail(
                                  program.slug,
                                  'useDetail',
                                  event.target.checked,
                                );
                              }}
                            />
                            Use
                          </label>
                        </div>

                        <div className="program-detail-admin-grid">
                          <label>
                            Heading
                            <input
                              maxLength={80}
                              value={program.detail.heading}
                              onChange={(event) => {
                                updateProgramDetail(program.slug, 'heading', event.target.value);
                              }}
                            />
                          </label>
                          <label>
                            Subheading
                            <input
                              maxLength={80}
                              value={program.detail.subheading}
                              onChange={(event) => {
                                updateProgramDetail(
                                  program.slug,
                                  'subheading',
                                  event.target.value,
                                );
                              }}
                            />
                          </label>
                          <label>
                            Title
                            <input
                              maxLength={80}
                              value={program.detail.title}
                              onChange={(event) => {
                                updateProgramDetail(program.slug, 'title', event.target.value);
                              }}
                            />
                          </label>
                          <label>
                            Subtitle
                            <input
                              maxLength={120}
                              value={program.detail.subtitle}
                              onChange={(event) => {
                                updateProgramDetail(program.slug, 'subtitle', event.target.value);
                              }}
                            />
                          </label>
                        </div>

                        <label>
                          Text Box
                          <textarea
                            className="program-admin-textbox"
                            value={program.detail.text}
                            onChange={(event) => {
                              updateProgramDetail(program.slug, 'text', event.target.value);
                            }}
                          />
                        </label>
                      </details>
                    </div>
                  ))}
                </section>

                <div className="hr-admin-actions">
                  {saveError && <p className="hr-admin-error">{saveError}</p>}
                  <button
                    type="button"
                    onClick={() => {
                      setDraftProgramContent(programContent);
                      setIsAdminOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="hr-admin-primary" type="button" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Programs;
