import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { loadSiteContent, saveSiteContent } from '../lib/siteContent';

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
  story: {
    introduction: string;
    quote: string;
    mantra: string;
    contactLabel: string;
    hrMembersTitle: string;
    contributorsTitle: string;
  };
  hrMembers: TeamMember[];
  contributors: TeamMember[];
};

type AboutPageContent = {
  aboutTitle: string;
  aboutParagraph: string;
  aboutImage: string;
  excellenceTitle: string;
  excellenceParagraph: string;
  sections: AboutPageSection[];
};

type AboutPageSection = {
  title: string;
  paragraph: string;
  image: string;
};

const aboutPageStorageKey = 'madison88-about-page-content';
const teamStorageKey = 'madison88-team-content';
const hrAdminUsername = 'hr-admin';
const hrAdminPassword = 'Madison88HR!2026';
const teamFieldLimits = {
  specialistName: 60,
  specialistRole: 90,
  specialistEmail: 80,
  headingTitle: 70,
  headingDescription: 180,
  memberTitle: 40,
  memberName: 45,
  memberRole: 80,
  storyText: 420,
  storyQuote: 260,
  groupTitle: 40,
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
  story: {
    introduction:
      'I am Arabelle Shanley T. Leano, an HR Associate and Learning & Organizational Development (L&OD) Specialist at Madison 88. I hold a BS in Psychology with Latin honors and work with the HR team to drive employee growth through impactful learning and development programs.',
    quote:
      '"Live as if you were to die tomorrow. Learn as if you were to live forever." - Mahatma Gandhi',
    mantra:
      '"It is my goal and aspiration to drive continuous learning within Madison 88 by aligning development initiatives with business goals, strengthening systems, and enabling people to perform at their best."',
    contactLabel: 'Contact Me',
    hrMembersTitle: 'HR Members',
    contributorsTitle: 'Contributors',
  },
  hrMembers: [
    {
      title: 'For Leadership Development',
      name: 'Laurence Obong',
      role: 'Director, Global HR & Administration',
      initials: 'LA',
      image: '',
    },
    {
      title: 'For US Best Practices',
      name: 'Lily Kedzuch',
      role: 'Administrator, Workplace Relations & Office Logistics',
      initials: 'LI',
      image: '',
    },
    {
      title: 'For Talent Acquisition',
      name: 'Sherheen Rabano',
      role: 'Manager, Administration & HR Business Partner',
      initials: 'SH',
      image: '',
    },
    {
      title: 'For Compensation & Benefits',
      name: 'Diane Tomale',
      role: 'Specialist, HR & Administration',
      initials: 'DI',
      image: '',
    },
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

const defaultAboutPageContent: AboutPageContent = {
  aboutTitle: 'We are Madison 88.',
  aboutParagraph:
    'A privately held outdoor accessories company with a primary office location in Denver, CO. We are a world-class design, development and manufacturing company that can help reimagine what your assortments can be.',
  aboutImage: '/images/about-person.png',
  excellenceTitle: 'Madison 88 Center for Excellence',
  excellenceParagraph:
    "At Madison 88 Center for Excellence, our mission is to empower employees with the skills and mindset needed to thrive in an ever-evolving business landscape. We aim to upskill and future-proof our workforce, fostering innovation and adaptability not only within the industries we serve but also in each individual's personal career journey. Through continuous learning, cutting-edge training, and a culture of growth, we prepare our people to lead with confidence, embrace change, and unlock their full potential.",
  sections: [],
};

function normalizeHrMembers(members: TeamMember[] | undefined) {
  if (!members?.length) return defaultTeamContent.hrMembers;

  const savedByName = new Map(members.map((member) => [member.name, member]));
  const legacyNames = new Set([
    ...defaultTeamContent.hrMembers.map((member) => member.name),
    'Weng',
  ]);
  const extraMembers = members.filter((member) => !legacyNames.has(member.name));

  return [
    ...defaultTeamContent.hrMembers.map((defaultMember) => {
      const savedMember = savedByName.get(defaultMember.name);
      return {
        ...defaultMember,
        image: savedMember?.image || defaultMember.image,
        initials: savedMember?.initials || defaultMember.initials,
      };
    }),
    ...extraMembers,
  ];
}

function normalizeTeamContent(content: Partial<TeamContent>): TeamContent {
  return {
    ...defaultTeamContent,
    ...content,
    heading: {
      ...defaultTeamContent.heading,
      ...content.heading,
    },
    specialist: {
      ...defaultTeamContent.specialist,
      ...content.specialist,
    },
    story: {
      ...defaultTeamContent.story,
      ...content.story,
    },
    hrMembers: normalizeHrMembers(content.hrMembers),
    contributors: content.contributors || defaultTeamContent.contributors,
  };
}

function loadTeamContent() {
  if (typeof window === 'undefined') {
    return defaultTeamContent;
  }

  const savedContent = window.localStorage.getItem(teamStorageKey);

  if (!savedContent) {
    return defaultTeamContent;
  }

  try {
    return normalizeTeamContent(JSON.parse(savedContent) as Partial<TeamContent>);
  } catch {
    return defaultTeamContent;
  }
}

async function saveTeamContent(content: TeamContent) {
  await saveSiteContent(teamStorageKey, content);
}

function loadAboutPageContent() {
  if (typeof window === 'undefined') {
    return defaultAboutPageContent;
  }

  const savedContent = window.localStorage.getItem(aboutPageStorageKey);

  if (!savedContent) {
    return defaultAboutPageContent;
  }

  try {
    const parsed = JSON.parse(savedContent) as Partial<AboutPageContent>;
    return {
      ...defaultAboutPageContent,
      ...parsed,
      sections: parsed.sections || [],
    };
  } catch {
    return defaultAboutPageContent;
  }
}

function normalizeAboutPageContent(content: Partial<AboutPageContent>): AboutPageContent {
  return {
    ...defaultAboutPageContent,
    ...content,
    sections: content.sections || [],
  };
}

async function saveAboutPageContent(content: AboutPageContent) {
  await saveSiteContent(aboutPageStorageKey, content);
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

function getBlankAboutSection(): AboutPageSection {
  return {
    title: 'New Section',
    paragraph: 'Add section content here.',
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
  const [aboutPageContent, setAboutPageContent] = useState(loadAboutPageContent);
  const [draftAboutPageContent, setDraftAboutPageContent] = useState(aboutPageContent);
  const [isAboutAdminOpen, setIsAboutAdminOpen] = useState(false);
  const [teamContent, setTeamContent] = useState(loadTeamContent);
  const [draftTeamContent, setDraftTeamContent] = useState(teamContent);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHrLoggedIn, setIsHrLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadSharedContent() {
      const [nextAboutPageContent, nextTeamContent] = await Promise.all([
        loadSiteContent(aboutPageStorageKey, defaultAboutPageContent, normalizeAboutPageContent),
        loadSiteContent(teamStorageKey, defaultTeamContent, normalizeTeamContent),
      ]);

      if (!isMounted) return;

      setAboutPageContent(nextAboutPageContent);
      setDraftAboutPageContent(nextAboutPageContent);
      setTeamContent(nextTeamContent);
      setDraftTeamContent(nextTeamContent);
    }

    loadSharedContent().catch(() => {
      setSaveError('Unable to load shared content from Supabase. Showing local/default content.');
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const openHrEditor = () => {
    setDraftTeamContent(teamContent);
    setIsAdminOpen(true);
  };

  const openAboutEditor = () => {
    setDraftAboutPageContent(aboutPageContent);
    setIsAboutAdminOpen(true);
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

  const handleTeamSave = async () => {
    try {
      await saveTeamContent(draftTeamContent);
      setTeamContent(draftTeamContent);
      setSaveError('');
      setIsAdminOpen(false);
    } catch {
      setSaveError('Save failed. Check the Supabase table and security policies.');
    }
  };

  const handleAboutPageSave = async () => {
    try {
      await saveAboutPageContent(draftAboutPageContent);
      setAboutPageContent(draftAboutPageContent);
      setSaveError('');
      setIsAboutAdminOpen(false);
    } catch {
      setSaveError('Save failed. Check the Supabase table and security policies.');
    }
  };

  const updateAboutPageContent = (field: keyof AboutPageContent, value: string) => {
    setDraftAboutPageContent((content) => ({
      ...content,
      [field]: value,
    }));
  };

  const deleteAboutImage = () => {
    updateAboutPageContent('aboutImage', '');
  };

  const addAboutSection = () => {
    setDraftAboutPageContent((content) => ({
      ...content,
      sections: [...content.sections, getBlankAboutSection()],
    }));
  };

  const updateAboutSection = (
    index: number,
    field: keyof AboutPageSection,
    value: string,
  ) => {
    setDraftAboutPageContent((content) => ({
      ...content,
      sections: content.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section,
      ),
    }));
  };

  const deleteAboutSection = (index: number) => {
    setDraftAboutPageContent((content) => ({
      ...content,
      sections: content.sections.filter((_, sectionIndex) => sectionIndex !== index),
    }));
  };

  const deleteAboutSectionImage = (index: number) => {
    updateAboutSection(index, 'image', '');
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

  const updateTeamStory = (field: keyof TeamContent['story'], value: string) => {
    setDraftTeamContent((content) => ({
      ...content,
      story: {
        ...defaultTeamContent.story,
        ...content.story,
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

  const deleteTeamMemberImage = (group: 'hrMembers' | 'contributors', index: number) => {
    updateTeamMember(group, index, 'image', '');
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
          <div className="about-image-card" aria-label="Madison88 learning session">
            {aboutPageContent.aboutImage && (
              <img
                src={aboutPageContent.aboutImage}
                alt={aboutPageContent.aboutTitle}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="about-copy">
            <h2
              onClick={(event) => {
                if (event.detail === 3) {
                  openAboutEditor();
                }
              }}
              style={{ cursor: 'default', userSelect: 'none' }}
            >
              {aboutPageContent.aboutTitle}
            </h2>
            <p>{aboutPageContent.aboutParagraph}</p>
          </div>
        </div>
      </section>

      <section className="excellence-section">
        <div className="section-inner excellence-content">
          <h2
            onClick={(event) => {
              if (event.detail === 3) {
                openAboutEditor();
              }
            }}
            style={{ cursor: 'default', userSelect: 'none' }}
          >
            {aboutPageContent.excellenceTitle}
          </h2>
          <p>{aboutPageContent.excellenceParagraph}</p>
        </div>
      </section>

      {aboutPageContent.sections.map((section, index) => (
        <section
          className={`about-extra-section${section.image ? '' : ' about-extra-section-no-image'}`}
          key={`${section.title}-${index}`}
        >
          <div className="section-inner about-extra-grid">
            {section.image && (
              <div className="about-extra-image-card">
                <img
                  src={section.image}
                  alt={section.title}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="about-copy">
              <h2
                onClick={(event) => {
                  if (event.detail === 3) {
                    openAboutEditor();
                  }
                }}
                style={{ cursor: 'default', userSelect: 'none' }}
              >
                {section.title}
              </h2>
              <p>{section.paragraph}</p>
            </div>
          </div>
        </section>
      ))}

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
                  <p>{teamContent.story?.introduction || defaultTeamContent.story.introduction}</p>
                </div>
                <div>
                  <p>{teamContent.story?.quote || defaultTeamContent.story.quote}</p>
                </div>
                <div>
                  <p>{teamContent.story?.mantra || defaultTeamContent.story.mantra}</p>
                </div>
              </div>
              <br />
              <a
                className="profile-contact"
                href={`mailto:${teamContent.specialist.email || defaultTeamContent.specialist.email}?subject=Learning%20%26%20Development%20Inquiry`}
              >
                {teamContent.story?.contactLabel || defaultTeamContent.story.contactLabel}
              </a>
            </article>

            <article className="specialist-card hr-members-card">
              <p className="profile-role">
                {teamContent.story?.hrMembersTitle || defaultTeamContent.story.hrMembersTitle}
              </p>
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
              <p className="profile-role">
                {teamContent.story?.contributorsTitle || defaultTeamContent.story.contributorsTitle}
              </p>
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

      {isAboutAdminOpen && (
        <div className="hr-admin-overlay" role="dialog" aria-modal="true" aria-label="About page editor">
          <div className="hr-admin-modal">
            <div className="hr-admin-header">
              <div>
                <p className="section-kicker">About Admin</p>
                <h2>{isHrLoggedIn ? 'Edit About Page' : 'Admin Login'}</h2>
              </div>
              <button
                className="hr-admin-close"
                type="button"
                onClick={() => {
                  setIsAboutAdminOpen(false);
                  setLoginError('');
                  setSaveError('');
                }}
                aria-label="Close about admin"
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
                  <h3>About Section</h3>
                  <div className="hr-admin-grid">
                    <label>
                      Title
                      <input
                        maxLength={80}
                        value={draftAboutPageContent.aboutTitle}
                        onChange={(event) => {
                          updateAboutPageContent('aboutTitle', event.target.value);
                        }}
                      />
                    </label>
                    <div className="hr-admin-upload-field">
                      <span>Image</span>
                      <div className="hr-admin-upload">
                        <div className="hr-admin-photo-preview">
                          {draftAboutPageContent.aboutImage && (
                            <img
                              src={draftAboutPageContent.aboutImage}
                              alt={draftAboutPageContent.aboutTitle}
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <span>About</span>
                        </div>
                        <input
                          id="about-page-image-upload"
                          className="hr-admin-file-input"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            handleImageUpload(event, (image) => {
                              updateAboutPageContent('aboutImage', image);
                            });
                          }}
                        />
                        <label className="hr-admin-file-button" htmlFor="about-page-image-upload">
                          Choose File
                        </label>
                      </div>
                    </div>
                  </div>
                  <label>
                    Paragraph
                    <textarea
                      maxLength={500}
                      value={draftAboutPageContent.aboutParagraph}
                      onChange={(event) => {
                        updateAboutPageContent('aboutParagraph', event.target.value);
                      }}
                    />
                  </label>
                  <button className="hr-admin-delete" type="button" onClick={deleteAboutImage}>
                    Delete Image
                  </button>
                </section>

                <section className="hr-admin-editor-section">
                  <h3>Center for Excellence Section</h3>
                  <label>
                    Title
                    <input
                      maxLength={90}
                      value={draftAboutPageContent.excellenceTitle}
                      onChange={(event) => {
                        updateAboutPageContent('excellenceTitle', event.target.value);
                      }}
                    />
                  </label>
                  <label>
                    Paragraph
                    <textarea
                      maxLength={900}
                      value={draftAboutPageContent.excellenceParagraph}
                      onChange={(event) => {
                        updateAboutPageContent('excellenceParagraph', event.target.value);
                      }}
                    />
                  </label>
                </section>

                <section className="hr-admin-editor-section">
                  <div className="hr-admin-section-heading">
                    <h3>Additional Sections</h3>
                    <button className="hr-admin-small-action" type="button" onClick={addAboutSection}>
                      Add Section
                    </button>
                  </div>

                  <div className="featured-course-admin-list">
                    {draftAboutPageContent.sections.map((section, index) => (
                      <div className="featured-course-admin-card" key={`about-section-${index}`}>
                        <div className="featured-course-admin-preview">
                          {section.image ? (
                            <img
                              src={section.image}
                              alt={section.title}
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <span>No image</span>
                          )}
                        </div>

                        <div className="featured-course-admin-fields">
                          <label>
                            Title
                            <input
                              maxLength={90}
                              value={section.title}
                              onChange={(event) => {
                                updateAboutSection(index, 'title', event.target.value);
                              }}
                            />
                          </label>
                          <label>
                            Paragraph
                            <textarea
                              maxLength={900}
                              value={section.paragraph}
                              onChange={(event) => {
                                updateAboutSection(index, 'paragraph', event.target.value);
                              }}
                            />
                          </label>

                          <div className="featured-course-admin-actions">
                            <label>
                              Image
                              <input
                                id={`about-extra-section-image-${index}`}
                                className="hr-admin-file-input"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                  handleImageUpload(event, (image) => {
                                    updateAboutSection(index, 'image', image);
                                  });
                                }}
                              />
                              <span className="hr-admin-file-button">Choose File</span>
                            </label>
                            <button
                              className="hr-admin-delete"
                              type="button"
                              onClick={() => {
                                deleteAboutSectionImage(index);
                              }}
                            >
                              Delete Image
                            </button>
                            <button
                              className="hr-admin-delete"
                              type="button"
                              onClick={() => {
                                deleteAboutSection(index);
                              }}
                            >
                              Delete Section
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="hr-admin-actions">
                  {saveError && <p className="hr-admin-error">{saveError}</p>}
                  <button
                    type="button"
                    onClick={() => {
                      setDraftAboutPageContent(aboutPageContent);
                      setIsAboutAdminOpen(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="hr-admin-primary" type="button" onClick={handleAboutPageSave}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                        <button
                          className="hr-admin-delete"
                          type="button"
                          onClick={() => {
                            updateSpecialist('image', '');
                          }}
                        >
                          Delete Image
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="hr-admin-editor-section">
                  <h3>Profile Story</h3>
                  <div className="hr-admin-grid">
                    <label>
                      Contact Button Text
                      <input
                        maxLength={teamFieldLimits.groupTitle}
                        value={draftTeamContent.story?.contactLabel || defaultTeamContent.story.contactLabel}
                        onChange={(event) => {
                          updateTeamStory('contactLabel', event.target.value);
                        }}
                      />
                    </label>
                    <label>
                      HR Members Heading
                      <input
                        maxLength={teamFieldLimits.groupTitle}
                        value={draftTeamContent.story?.hrMembersTitle || defaultTeamContent.story.hrMembersTitle}
                        onChange={(event) => {
                          updateTeamStory('hrMembersTitle', event.target.value);
                        }}
                      />
                    </label>
                    <label>
                      Contributors Heading
                      <input
                        maxLength={teamFieldLimits.groupTitle}
                        value={draftTeamContent.story?.contributorsTitle || defaultTeamContent.story.contributorsTitle}
                        onChange={(event) => {
                          updateTeamStory('contributorsTitle', event.target.value);
                        }}
                      />
                    </label>
                  </div>
                  <label>
                    Introduction
                    <textarea
                      maxLength={teamFieldLimits.storyText}
                      value={draftTeamContent.story?.introduction || defaultTeamContent.story.introduction}
                      onChange={(event) => {
                        updateTeamStory('introduction', event.target.value);
                      }}
                    />
                  </label>
                  <label>
                    Quote
                    <textarea
                      maxLength={teamFieldLimits.storyQuote}
                      value={draftTeamContent.story?.quote || defaultTeamContent.story.quote}
                      onChange={(event) => {
                        updateTeamStory('quote', event.target.value);
                      }}
                    />
                  </label>
                  <label>
                    Goal / Mantra
                    <textarea
                      maxLength={teamFieldLimits.storyText}
                      value={draftTeamContent.story?.mantra || defaultTeamContent.story.mantra}
                      onChange={(event) => {
                        updateTeamStory('mantra', event.target.value);
                      }}
                    />
                  </label>
                </section>

                <section className="hr-admin-editor-section">
                  <div className="hr-admin-section-heading">
                    <h3>{draftTeamContent.story?.hrMembersTitle || defaultTeamContent.story.hrMembersTitle}</h3>
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
                        <button
                          className="hr-admin-delete"
                          type="button"
                          onClick={() => {
                            deleteTeamMemberImage('hrMembers', index);
                          }}
                        >
                          Delete Image
                        </button>
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
                    <h3>{draftTeamContent.story?.contributorsTitle || defaultTeamContent.story.contributorsTitle}</h3>
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
                        <button
                          className="hr-admin-delete"
                          type="button"
                          onClick={() => {
                            deleteTeamMemberImage('contributors', index);
                          }}
                        >
                          Delete Image
                        </button>
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
