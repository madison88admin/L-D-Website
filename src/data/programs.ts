export type Program = {
  slug: string;
  title: string;
  summary: string;
  accent: string;
  image: string;
  link?: string;
  detail: ProgramDetailContent;
  modules?: ProgramModule[];
};

export type ProgramTextAlign = 'left' | 'center' | 'right' | 'justify';

export type ProgramDetailContent = {
  heading: string;
  subheading: string;
  title: string;
  subtitle: string;
  text: string;
  useDetail: boolean;
  textColor: string;
  textSize: string;
  isBold: boolean;
  isIndented: boolean;
  alignment: ProgramTextAlign;
};

export type ModuleItem = string | { text: string; subItems: string[] };

export type ModuleSection = {
  heading?: string;
  items: ModuleItem[];
};

export type ProgramModule = {
  slug: string;
  number: number;
  title: string;
  displayHeading?: string; // overrides "Module N: title" display (supports {{bold}} markers)
  isUpcoming?: boolean;
  sections: ModuleSection[];
  footnote?: string;
};

const defaultDetail = (
  heading: string,
  subheading: string,
  title: string,
  subtitle: string,
  text: string,
): ProgramDetailContent => ({
  heading,
  subheading,
  title,
  subtitle,
  text,
  useDetail: true,
  textColor: '#173c63',
  textSize: '2rem',
  isBold: false,
  isIndented: false,
  alignment: 'left',
});

export const legacyProgramTitles: Record<string, string[]> = {
  'ai-technology': ['AI & Technology'],
  communication: ['Communications'],
  'emotional-intelligence-well-being': ['Emotional Intelligence & Well-being'],
  interpersonal: ['Interpersonal'],
  leadership: ['Leadership'],
  'problem-solving-critical-thinking': ['Problem-Solving & Critical Thinking'],
  'productivity-mindfulness': ['Productivity & Mindfulness'],
};

const programOrder = [
  'ai-technology',
  'communication',
  'customer-service',
  'emotional-intelligence-well-being',
  'leadership',
  'interpersonal',
  'problem-solving-critical-thinking',
  'productivity-mindfulness',
];

const programCatalog: Program[] = [
  {
    slug: 'ai-technology',
    title: 'AI & Information Technology',
    summary: 'Explore practical AI tools, digital systems, and technology skills for smarter work.',
    accent: '#5dbdca',
    image: '/images/programs/ai-technology.jpg',
    detail: defaultDetail(
      'AI & Information Technology',
      '',
      'Topics:',
      '',
      '• AI, Gen AI, and Agentics in Today\'s Supply Chain Management *Upcoming training\n• Supply Chain Analytics: Driving Efficiency and Innovation *Upcoming training',
    ),
  },
  {
    slug: 'communication',
    title: 'Communication',
    summary: 'Build clearer messaging, active listening, and confident workplace conversations.',
    accent: '#69aee7',
    image: '/images/programs/communication.jpg',
    detail: defaultDetail(
      'Communication',
      'Skills Training',
      'Topics:',
      '',
      'Module 1: Foundations of Communication\nModule 2: Effective Business Communication\nModule 3: Active Listening & Feedback\nModule 4: Emotional Intelligence in Communication *Upcoming training\nModule 5: Cross-Cultural Communication *Upcoming training\n*Access in the module is embedded on the topics.',
    ),
  },
  {
    slug: 'customer-service',
    title: 'Customer Service',
    summary: 'Strengthen service mindset, client care, and practical issue resolution.',
    accent: '#f3b35b',
    image: '/images/programs/customer-service.jpg',
    detail: defaultDetail(
      'Customer Service',
      'Skills Training',
      'Topics:',
      '',
      'Module 1: Foundations of Customer Service\nModule 2: Email Etiquette, Video / Phone Calls\nModule 3: Relationship Management\n*Access in the module is embedded on the topics.',
    ),
  },
  {
    slug: 'emotional-intelligence-well-being',
    title: 'Departmental & Position-Based Trainings (PBTs)',
    summary: 'Support role-specific learning paths, team standards, and department training needs.',
    accent: '#7fb36d',
    image: '/images/programs/emotional-intelligence.jpg',
    detail: defaultDetail(
      'Departmental & Position-Based Trainings (PBTs)',
      'Role-Based Learning',
      'Topics:',
      '',
      '• {{The Emotional Intelligence Advantage:}} Mastering Change and Difficult Conversations *Upcoming training',
    ),
  },
  {
    slug: 'interpersonal',
    title: 'Organizational & Cultural Development',
    summary: 'Strengthen culture, collaboration, change readiness, and shared ways of working.',
    accent: '#9b8de3',
    image: '/images/programs/interpersonal.jpg',
    detail: defaultDetail(
      'Organizational & Cultural Development',
      'Culture & Change',
      'Topics:',
      '',
      '• 15 Ways to Develop and Maintain a Positive Attitude at Work *Upcoming training\n• Important Conflict Resolution Skills in the Workplace *Upcoming training',
    ),
  },
  {
    slug: 'leadership',
    title: 'Leadership Development',
    summary: 'Develop decision-making, coaching, accountability, and team leadership habits.',
    accent: '#65c29b',
    image: '/images/programs/leadership.jpg',
    detail: defaultDetail(
      'Leadership Development',
      'Development',
      'Topics:',
      '',
      'Module 1: Foundations: Manager vs Leader\nModule 2: Madison 88 Style of Leadership\nModule 3: [G]overning\nModule 4: [U]pskilling\nModule 5: [I]nspiring\nModule 6: [D]elivering\nModule 7: [E]levating\nModule 8: Our Next Steps: Strategic Mindshift & Forward Momentum',
    ),
    modules: [
      {
        slug: 'module-1',
        number: 1,
        title: 'Foundations - Manager vs Leader',
        isUpcoming: false,
        sections: [
          {
            heading: 'MANAGER',
            items: [
              'Good vs Bad Manager',
              'Transition from Staff to Manager',
              'Common Mistakes of [NEW] Manager',
            ],
          },
          {
            heading: 'FOUNDATIONS OF MANAGEMENT - P.L.O.C.',
            items: ['Plan', 'Lead', 'Organize', 'Control'],
          },
          {
            heading: 'LEADER',
            items: [
              "Manager' vs 'Leader'",
              {
                text: 'Leadership Theories and Styles',
                subItems: ['Basic Types', 'New Types', 'Popular Types (Best Practices)'],
              },
            ],
          },
        ],
        footnote: '*Access in the module is embedded on the title.',
      },
      {
        slug: 'module-2',
        number: 2,
        title: 'Madison 88 Style of Leadership',
        isUpcoming: false,
        sections: [
          {
            items: [
              'Defining Leadership',
              'Core Competencies of Effective Leaders (//Most Attractive Qualities of Exceptional Leaders//)',
              'Think Like the Owners (TLO)',
              '{{BOOK:}} //Dare to Lead// by //Brené Brown//',
            ],
          },
        ],
        footnote: '*Access in the module is embedded on the title.',
      },
      {
        slug: 'module-3',
        number: 3,
        title: 'Governing',
        isUpcoming: true,
        sections: [
          {
            heading: 'GOVERNANCE',
            items: [
              'Governance based on ILO Standard',
              'ESG Manual Overview',
              'Country-Specific: Legal Framework - Managerial Positions in the (Philippines, USA, & Indonesia)',
              'Harassment, Reasonable Accommodations (ADA), Anti-Bribery & Corruption, Data Security & Privacy, Protected Status',
              'Company-Specific: Knowing Our Company Policies & Procedures',
            ],
          },
          {
            heading: 'GOVERNANCE (Application)',
            items: [
              'Open-Door Policy',
              'Documentation for Infractions and Non-Performance',
              'FAIRNESS & Equality',
            ],
          },
          {
            heading: 'GOVERNANCE (Essence)',
            items: ['EMPATHY'],
          },
        ],
      },
      {
        slug: 'module-4',
        number: 4,
        title: 'Upskilling',
        isUpcoming: true,
        sections: [
          {
            heading: 'CREATING A LEARNING CULTURE',
            items: [
              'Inwards then Outwards',
              'Learning & Development vis-a-vis Performance Management',
            ],
          },
          {
            heading: 'IDENTIFYING SKILLS GAP',
            items: [
              'KPIs & Performance Appraisal',
              'Operational Observation',
              'Learning Needs Analysis',
            ],
          },
          {
            heading: 'FUTURE-PROOFING OUR CAREERS & OUR COMPANY',
            items: [
              'SUCCESSION PLANNING',
              'L&D Workflow',
              'Times are changing...How do we stay relevant?',
            ],
          },
        ],
      },
      {
        slug: 'module-5',
        number: 5,
        title: 'Inspiring',
        isUpcoming: true,
        sections: [
          {
            heading: 'MOTIVATION',
            items: ['What Motivates You?', 'Types of Motivation'],
          },
          {
            heading: 'LEADING BY EXAMPLE',
            items: ['Integrity', 'Authentic Charisma', 'Leaders as Influencer'],
          },
          {
            heading: 'COACHING',
            items: [
              'Professional Coaching in Workplace',
              'Intentional Listening',
              'Persuasive Communication',
            ],
          },
        ],
      },
      {
        slug: 'module-6',
        number: 6,
        title: 'Delivering',
        isUpcoming: true,
        sections: [
          {
            heading: 'PERFORMANCE MANAGEMENT',
            items: ['Delivering', 'Responsibilities'],
          },
          {
            heading: 'CLEAR & FOCUSED: KPI SETTING',
            items: [
              'Big Picture, Small Picture',
              'Organizational --> Departmental --> Individual Goals',
            ],
          },
          {
            heading: 'DELEGATION',
            items: [
              'Professional Coaching in Workplace',
              'Intentional Listening',
              'Persuasive Communication',
            ],
          },
        ],
      },
      {
        slug: 'module-7',
        number: 7,
        title: 'Elevating',
        isUpcoming: true,
        sections: [
          {
            heading: "BOOK: WHAT GOT YOU HERE, WON'T GET YOU THERE",
            items: [
              "Why past behaviors don't guarantee future success",
              'Transition from technical competence to leadership effectiveness',
              'The importance of behavioral change for career advancement',
            ],
          },
          {
            heading: 'CONTINUOUS IMPROVEMENT',
            items: [
              'The Question Is: WHAT ELSE CAN YOU/WE DO BETTER?',
              'Steps to Implement Continuous Improvement',
            ],
          },
        ],
      },
      {
        slug: 'module-8',
        number: 8,
        title: 'Strategic Mindshift & Forward Momentum',
        displayHeading: '{{Our Next Steps:}} Strategic Mindshift & Forward Momentum',
        isUpcoming: true,
        sections: [
          {
            heading: 'UNDERSTANDING STRATEGIC MINDSHIFT',
            items: ['Key Drivers for Change', 'Cultural and Behavioral Shifts'],
          },
          {
            heading: 'FORWARD MOMENTUM: BUILDING THE PATH AHEAD',
            items: ['Setting Clear Objectives', 'Aligning Teams and Resources'],
          },
          {
            heading: 'ACTION PLAN',
            items: ['Immediate Next Steps', 'Mid-Term Initiatives', 'Long-Term Vision'],
          },
        ],
      },
    ],
  },
  {
    slug: 'problem-solving-critical-thinking',
    title: 'Personal Development',
    summary: 'Build self-awareness, confidence, resilience, and habits for continuous growth.',
    accent: '#e77979',
    image: '/images/programs/problem-solving.jpg',
    detail: defaultDetail(
      'Personal Development',
      'Growth',
      'Topics:',
      '',
      'Self-awareness\nResilience and well-being\nGrowth mindset and personal effectiveness',
    ),
  },
  {
    slug: 'productivity-mindfulness',
    title: 'Professional & Technical Skills',
    summary: 'Develop practical business, technical, productivity, and role-ready capabilities.',
    accent: '#d7a85b',
    image: '/images/programs/productivity-mindfulness.jpg',
    detail: defaultDetail(
      'Professional & Technical Skills',
      'Skills Training',
      'Topics:',
      '',
      '• The Mindful \'Yes\' and \'No\': How to Make Choices with Clarity and Integrity *Upcoming training\n• Boost Memory and Focus with Mindfulness: Science-Backed Techniques *Upcoming training\n• How to Create Productive Morning Routine *Upcoming training',
    ),
  },
];

export const programs: Program[] = [...programCatalog].sort(
  (a, b) => programOrder.indexOf(a.slug) - programOrder.indexOf(b.slug),
);

export function getProgramBySlug(slug: string | undefined) {
  return programs.find((program) => program.slug === slug);
}

export function getLinkThumbnail(link: string | undefined) {
  if (!link) return '';

  try {
    const url = new URL(link);
    const directImagePattern = /\.(apng|avif|gif|jpe?g|png|svg|webp)$/i;

    if (directImagePattern.test(url.pathname)) {
      return link;
    }

    const youtubeMatch =
      url.hostname.includes('youtu.be')
        ? url.pathname.split('/').filter(Boolean)[0]
        : url.searchParams.get('v');

    if (youtubeMatch && (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be'))) {
      return `https://img.youtube.com/vi/${youtubeMatch}/hqdefault.jpg`;
    }

    const driveMatch =
      url.hostname.includes('drive.google.com') &&
      (url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || url.searchParams.get('id'));

    if (driveMatch) {
      return `https://drive.google.com/thumbnail?id=${driveMatch}&sz=w800`;
    }

    return `https://www.google.com/s2/favicons?sz=256&domain_url=${encodeURIComponent(url.origin)}`;
  } catch {
    return '';
  }
}

export function getProgramThumbnail(program: Pick<Program, 'image' | 'link'>) {
  return program.image || getLinkThumbnail(program.link);
}
