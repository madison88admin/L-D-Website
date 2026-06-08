import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';

type TeamMember = {
  title?: string;
  name: string;
  role: string;
  initials: string;
  image: string;
};

type TeamContent = {
  heading: {
    title: string;
    description: string;
  };
  specialist: TeamMember & {
    bio: string;
    email?: string;
  };
  hrMembers: TeamMember[];
  contributors: TeamMember[];
};

const teamStorageKey = 'madison88-team-content';
const hrAdminUsername = 'hr-admin';
const hrAdminPassword = 'change-this-password';
const teamFieldLimits = {
  specialistName: 60,
  specialistRole: 90,
  specialistBio: 180,
  specialistEmail: 80,
  headingTitle: 70,
  headingDescription: 180,
  memberTitle: 40,
  memberName: 45,
  memberRole: 80,
};

const defaultTeamContent: TeamContent = {
  heading: {
    title: 'L&D Specialist Profile',
    description:
      'A cross-functional learning group supporting programs, operations, systems, and team capability across Madison88.',
  },
  specialist: {
    title: 'L&D Specialist',
    name: 'Arabelle Shanley Leano',
    role: 'HR & Admin Associate, Learning & Development Specialist',
    initials: 'AS',
    image: '/images/team/arabelle-shanley-leano.png',
    email: 'arabelle.leano@madison88.com',
    bio:
      'Leads learning coordination, program support, and development initiatives for the Global HR & Admin group.',
  },
  hrMembers: [
    {
      name: 'Laurence Obong',
      role: 'Director, Global HR & Administration',
      initials: 'LA',
      image: '',
    },
    {
      name: 'Lily Kedzuch',
      role: 'Office Administrator, Workplace Relations & Logistics',
      initials: 'LI',
      image: '',
    },
    { name: 'Weng', role: 'HR Member', initials: 'WE', image: '' },
    {
      name: 'Sherheen Rabano',
      role: 'Manager, Admin & HR Business Partner',
      initials: 'SH',
      image: '',
    },
    { name: 'Diane Tomale', role: 'HR & Admin Specialist', initials: 'DI', image: '' },
  ],
  contributors: [
    { name: 'Paul Avendano', role: 'IT & AI', initials: 'PA', image: '' },
    { name: 'Edwin', role: 'Process Improvement', initials: 'ED', image: '' },
    { name: 'Lindsey', role: 'Production', initials: 'LI', image: '' },
    { name: 'Kendall', role: 'Product & Business Dev.', initials: 'KE', image: '' },
    { name: 'Polly', role: 'Global Ops', initials: 'PO', image: '' },
    { name: 'James', role: 'Leadership', initials: 'JA', image: '' },
    { name: 'CC', role: 'Financial Systems', initials: 'CC', image: '' },
    { name: 'Eric', role: 'Manuf. & QA', initials: 'ER', image: '' },
    { name: 'Cris Ascano', role: 'Administration', initials: 'CA', image: '' },
  ],
};

const specialistIntroduction =
  'I am Arabelle Shanley T. Leano, an HR Associate and Learning & Organizational Development (L&OD) Specialist at Madison 88. I hold a BS in Psychology with Latin honors and work with the HR team to drive employee growth through impactful learning and development programs.';

const specialistQuote =
  '"Live as if you were to die tomorrow. Learn as if you were to live forever." - Mahatma Gandhi';

const specialistMantra =
  '"It is my goal and aspiration to drive continuous learning within Madison 88 by aligning development initiatives with business goals, strengthening systems, and enabling people to perform at their best."';

function loadTeamContent() {
  if (typeof window === 'undefined') {
    return defaultTeamContent;
  }

  const savedContent = window.localStorage.getItem(teamStorageKey);

  if (!savedContent) {
    return defaultTeamContent;
  }

  try {
    return JSON.parse(savedContent) as TeamContent;
  } catch {
    return defaultTeamContent;
  }
}

function saveTeamContent(content: TeamContent) {
  window.localStorage.setItem(teamStorageKey, JSON.stringify(content));
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
      const maxSize = 640;
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
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };

    image.onerror = () => {
      reject(new Error('Unable to load image file.'));
    };

    reader.readAsDataURL(file);
  });
}

function getBlankMember(): TeamMember {
  return {
    title: 'Team Member',
    name: 'New Member',
    role: 'Role',
    initials: 'NM',
    image: '',
  };
}

function renderMemberPhoto(member: TeamMember) {
  return (
    <>
      {member.image && (
        <img
          src={member.image}
          alt={member.name}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      )}
      <span>{member.initials}</span>
    </>
  );
}

function AboutUs() {
  const [teamContent, setTeamContent] = useState(loadTeamContent);
  const [draftTeamContent, setDraftTeamContent] = useState(teamContent);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHrLoggedIn, setIsHrLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [saveError, setSaveError] = useState('');

  const openHrEditor = () => {
    setDraftTeamContent(teamContent);
    setIsAdminOpen(true);
  };

  const handleAdminLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loginForm.username === hrAdminUsername && loginForm.password === hrAdminPassword) {
      setIsHrLoggedIn(true);
      setLoginError('');
      return;
    }

    setLoginError('Invalid HR login.');
  };

  const handleTeamSave = () => {
    try {
      saveTeamContent(draftTeamContent);
      setTeamContent(draftTeamContent);
      setSaveError('');
      setIsAdminOpen(false);
    } catch {
      setSaveError('Save failed. Try using smaller photos or fewer large uploads.');
    }
  };

  const updateSectionHeading = (field: keyof TeamContent['heading'], value: string) => {
    setDraftTeamContent((content) => ({
      ...content,
      heading: {
        title: content.heading?.title || defaultTeamContent.heading.title,
        description: content.heading?.description || defaultTeamContent.heading.description,
        [field]: value,
      },
    }));
  };

  const updateSpecialist = (field: keyof TeamContent['specialist'], value: string) => {
    setDraftTeamContent((content) => ({
      ...content,
      specialist: {
        ...content.specialist,
        [field]: value,
      },
    }));
  };

  const updateTeamMember = (
    group: 'hrMembers' | 'contributors',
    index: number,
    field: keyof TeamMember,
    value: string,
  ) => {
    setDraftTeamContent((content) => ({
      ...content,
      [group]: content[group].map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member,
      ),
    }));
  };

  const addTeamMember = (group: 'hrMembers' | 'contributors') => {
    setDraftTeamContent((content) => ({
      ...content,
      [group]: [...content[group], getBlankMember()],
    }));
  };

  const deleteTeamMember = (group: 'hrMembers' | 'contributors', index: number) => {
    setDraftTeamContent((content) => ({
      ...content,
      [group]: content[group].filter((_, memberIndex) => memberIndex !== index),
    }));
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    updateImage: (image: string) => void,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const resizedImage = await resizeImageForStorage(file);
      updateImage(resizedImage);
      setSaveError('');
    } catch {
      setSaveError('Image upload failed. Please try a different image.');
    }
  };

  return (
    <div className="home-page">
      <section className="home-about">
        <div className="section-inner about-grid">
          <div className="about-image-card" aria-label="Madison88 learning session"></div>

          <div className="about-copy">
            <h2>We are Madison 88.</h2>
            <p>
              A privately held outdoor accessories company with a primary office
              location in Denver, CO. We are a world-class design, development and
              manufacturing company that can help reimagine what your assortments
              can be.
            </p>
          </div>
        </div>
      </section>

      <section className="excellence-section">
        <div className="section-inner excellence-content">
          <h2>Madison 88 Center for Excellence</h2>
          <p>
            At Madison 88 Center for Excellence, our mission is to empower
            employees with the skills and mindset needed to thrive in an
            ever-evolving business landscape. We aim to <strong>upskill</strong>{' '}
            and <strong>future-proof our workforce</strong>, fostering innovation
            and adaptability not only within the industries we serve but also in
            each individual's personal career journey. Through continuous
            learning, cutting-edge training, and a culture of growth, we prepare
            our people to lead with confidence, embrace change, and unlock their
            full potential.
          </p>
        </div>
      </section>

      <section className="specialists-section">
        <div className="section-inner">
          <div
            className="specialists-heading"
            onClick={(event) => {
              if (event.detail === 3) {
                openHrEditor();
              }
            }}
          >
            <h2>{teamContent.heading?.title || defaultTeamContent.heading.title}</h2>
            <p>{teamContent.heading?.description || defaultTeamContent.heading.description}</p>
          </div>

          <div className="profile-layout">
            <article
              className="specialist-card profile-card"
              onClick={(event) => {
                if (event.detail === 3) {
                  openHrEditor();
                }
              }}
            >
              <div className="profile-card-header">
                <div className="specialist-photo profile-photo">
                  {renderMemberPhoto(teamContent.specialist)}
                </div>
                <div className="profile-card-intro">
                  <p className="profile-title">
                    {teamContent.specialist.title || 'L&D Specialist'}
                  </p>
                  <h3>{teamContent.specialist.name}</h3>
                  <p className="profile-role">{teamContent.specialist.role}</p>
                </div>
              </div>
              <div className="profile-story">
                <div>
                  <p>{specialistIntroduction}</p>
                </div>
                <div>
                  <p>{specialistQuote}</p>
                </div>
                <div>
                  <p>{specialistMantra}</p>
                </div>
              </div>
              <br />
              <a
                className="profile-contact"
                href={`mailto:${teamContent.specialist.email || defaultTeamContent.specialist.email}?subject=Learning%20%26%20Development%20Inquiry`}
              >
                Contact Me
              </a>
            </article>

            <article className="specialist-card hr-members-card">
              <p className="profile-role">HR Members</p>
              <div className="hr-member-list">
                {teamContent.hrMembers.map((member) => (
                  <article className="contributor-profile" key={member.name}>
                    <div className="contributor-photo">
                      {renderMemberPhoto(member)}
                    </div>
                    <div className="contributor-details">
                      <p className="member-profile-title">{member.title || 'HR Member'}</p>
                      <h4>{member.name}</h4>
                      <p>{member.role}</p>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="specialist-card contributors-card">
              <p className="profile-role">Contributors</p>
              <div className="contributors-list">
                {teamContent.contributors.map((contributor) => (
                  <article className="contributor-profile" key={contributor.name}>
                    <div className="contributor-photo">
                      {renderMemberPhoto(contributor)}
                    </div>
                    <div className="contributor-details">
                      <p className="member-profile-title">{contributor.title || 'Contributor'}</p>
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

      {isAdminOpen && (
        <div className="hr-admin-overlay" role="dialog" aria-modal="true" aria-label="HR team editor">
          <div className="hr-admin-modal">
            <div className="hr-admin-header">
              <div>
                <p className="section-kicker">HR Admin</p>
                <h2>{isHrLoggedIn ? 'Edit L&D Specialist Section' : 'HR Team Login'}</h2>
              </div>
              <button
                className="hr-admin-close"
                type="button"
                onClick={() => {
                  setIsAdminOpen(false);
                  setLoginError('');
                  setSaveError('');
                }}
                aria-label="Close HR admin"
              >
                x
              </button>
            </div>

            {!isHrLoggedIn ? (
              <form className="hr-admin-login" onSubmit={handleAdminLogin}>
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
                  <h3>Section Header</h3>
                  <div className="hr-admin-grid">
                    <label>
                      Heading
                      <input
                        maxLength={teamFieldLimits.headingTitle}
                        value={draftTeamContent.heading?.title || defaultTeamContent.heading.title}
                        onChange={(event) => {
                          updateSectionHeading('title', event.target.value);
                        }}
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        maxLength={teamFieldLimits.headingDescription}
                        value={
                          draftTeamContent.heading?.description ||
                          defaultTeamContent.heading.description
                        }
                        onChange={(event) => {
                          updateSectionHeading('description', event.target.value);
                        }}
                      />
                    </label>
                  </div>
                </section>

                <section className="hr-admin-editor-section">
                  <h3>L&amp;D Specialist</h3>
                  <div className="hr-admin-grid">
                    <label>
                      Title
                      <input
                        maxLength={teamFieldLimits.memberTitle}
                        value={draftTeamContent.specialist.title || 'L&D Specialist'}
                        onChange={(event) => {
                          updateSpecialist('title', event.target.value);
                        }}
                      />
                    </label>
                    <label>
                      Name
                      <input
                        maxLength={teamFieldLimits.specialistName}
                        value={draftTeamContent.specialist.name}
                        onChange={(event) => {
                          updateSpecialist('name', event.target.value);
                        }}
                      />
                    </label>
                    <label>
                      Role
                      <input
                        maxLength={teamFieldLimits.specialistRole}
                        value={draftTeamContent.specialist.role}
                        onChange={(event) => {
                          updateSpecialist('role', event.target.value);
                        }}
                      />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        maxLength={teamFieldLimits.specialistEmail}
                        value={
                          draftTeamContent.specialist.email || defaultTeamContent.specialist.email
                        }
                        onChange={(event) => {
                          updateSpecialist('email', event.target.value);
                        }}
                      />
                    </label>
                    <div className="hr-admin-upload-field">
                      <span>Photo</span>
                      <div className="hr-admin-upload">
                        <div className="hr-admin-photo-preview">
                          {renderMemberPhoto(draftTeamContent.specialist)}
                        </div>
                        <input
                          id="about-specialist-photo-upload"
                          className="hr-admin-file-input"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            handleImageUpload(event, (image) => {
                              updateSpecialist('image', image);
                            });
                          }}
                        />
                        <label
                          className="hr-admin-file-button"
                          htmlFor="about-specialist-photo-upload"
                        >
                          Choose File
                        </label>
                      </div>
                    </div>
                  </div>
                  <label>
                    Bio
                    <textarea
                      maxLength={teamFieldLimits.specialistBio}
                      value={draftTeamContent.specialist.bio}
                      onChange={(event) => {
                        updateSpecialist('bio', event.target.value);
                      }}
                    />
                  </label>
                </section>

                <section className="hr-admin-editor-section">
                  <div className="hr-admin-section-heading">
                    <h3>HR Members</h3>
                    <button
                      className="hr-admin-small-action"
                      type="button"
                      onClick={() => {
                        addTeamMember('hrMembers');
                      }}
                    >
                      Add Member
                    </button>
                  </div>
                  <div className="hr-admin-member-header" aria-hidden="true">
                    <span>Photo</span>
                    <span>Title</span>
                    <span>Full Name</span>
                    <span>Position</span>
                    <span></span>
                  </div>
                  {draftTeamContent.hrMembers.map((member, index) => (
                    <div className="hr-admin-member-row" key={`about-hr-${index}`}>
                      <div className="hr-admin-photo-editor">
                        <div className="hr-admin-photo-preview">{renderMemberPhoto(member)}</div>
                        <input
                          id={`about-hr-member-photo-upload-${index}`}
                          className="hr-admin-file-input"
                          type="file"
                          accept="image/*"
                          aria-label="Upload HR member photo"
                          onChange={(event) => {
                            handleImageUpload(event, (image) => {
                              updateTeamMember('hrMembers', index, 'image', image);
                            });
                          }}
                        />
                        <label
                          className="hr-admin-file-button"
                          htmlFor={`about-hr-member-photo-upload-${index}`}
                        >
                          Choose File
                        </label>
                      </div>
                      <input
                        aria-label="HR member title"
                        maxLength={teamFieldLimits.memberTitle}
                        value={member.title || 'HR Member'}
                        onChange={(event) => {
                          updateTeamMember('hrMembers', index, 'title', event.target.value);
                        }}
                      />
                      <input
                        aria-label="HR member name"
                        maxLength={teamFieldLimits.memberName}
                        value={member.name}
                        onChange={(event) => {
                          updateTeamMember('hrMembers', index, 'name', event.target.value);
                        }}
                      />
                      <input
                        aria-label="HR member role"
                        maxLength={teamFieldLimits.memberRole}
                        value={member.role}
                        onChange={(event) => {
                          updateTeamMember('hrMembers', index, 'role', event.target.value);
                        }}
                      />
                      <button
                        className="hr-admin-delete"
                        type="button"
                        onClick={() => {
                          deleteTeamMember('hrMembers', index);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </section>

                <section className="hr-admin-editor-section">
                  <div className="hr-admin-section-heading">
                    <h3>Contributors</h3>
                    <button
                      className="hr-admin-small-action"
                      type="button"
                      onClick={() => {
                        addTeamMember('contributors');
                      }}
                    >
                      Add Member
                    </button>
                  </div>
                  <div className="hr-admin-member-header" aria-hidden="true">
                    <span>Photo</span>
                    <span>Title</span>
                    <span>Full Name</span>
                    <span>Position</span>
                    <span></span>
                  </div>
                  {draftTeamContent.contributors.map((member, index) => (
                    <div className="hr-admin-member-row" key={`about-contributor-${index}`}>
                      <div className="hr-admin-photo-editor">
                        <div className="hr-admin-photo-preview">{renderMemberPhoto(member)}</div>
                        <input
                          id={`about-contributor-photo-upload-${index}`}
                          className="hr-admin-file-input"
                          type="file"
                          accept="image/*"
                          aria-label="Upload contributor photo"
                          onChange={(event) => {
                            handleImageUpload(event, (image) => {
                              updateTeamMember('contributors', index, 'image', image);
                            });
                          }}
                        />
                        <label
                          className="hr-admin-file-button"
                          htmlFor={`about-contributor-photo-upload-${index}`}
                        >
                          Choose File
                        </label>
                      </div>
                      <input
                        aria-label="Contributor title"
                        maxLength={teamFieldLimits.memberTitle}
                        value={member.title || 'Contributor'}
                        onChange={(event) => {
                          updateTeamMember('contributors', index, 'title', event.target.value);
                        }}
                      />
                      <input
                        aria-label="Contributor name"
                        maxLength={teamFieldLimits.memberName}
                        value={member.name}
                        onChange={(event) => {
                          updateTeamMember('contributors', index, 'name', event.target.value);
                        }}
                      />
                      <input
                        aria-label="Contributor role"
                        maxLength={teamFieldLimits.memberRole}
                        value={member.role}
                        onChange={(event) => {
                          updateTeamMember('contributors', index, 'role', event.target.value);
                        }}
                      />
                      <button
                        className="hr-admin-delete"
                        type="button"
                        onClick={() => {
                          deleteTeamMember('contributors', index);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </section>

                <div className="hr-admin-actions">
                  {saveError && <p className="hr-admin-error">{saveError}</p>}
                  <button
                    type="button"
                    onClick={() => {
                      setDraftTeamContent(teamContent);
                      setIsAdminOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="hr-admin-primary" type="button" onClick={handleTeamSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutUs;
