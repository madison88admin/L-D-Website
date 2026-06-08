export type Program = {
  slug: string;
  title: string;
  summary: string;
  accent: string;
  image: string;
  detail: ProgramDetailContent;
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

export const programs: Program[] = [
  {
    slug: 'ai-technology',
    title: 'AI & Technology',
    summary: 'Explore practical tools and digital skills for smarter, more adaptive work.',
    accent: '#5dbdca',
    image: '/images/programs/ai-technology.jpg',
    detail: defaultDetail(
      'AI & Technology',
      'Enablement',
      'Topics:',
      '',
      'Practical AI tools for daily work\nDigital productivity workflows\nTechnology adoption habits',
    ),
  },
  {
    slug: 'communication',
    title: 'Communications',
    summary: 'Build clearer messaging, active listening, and confident workplace conversations.',
    accent: '#69aee7',
    image: '/images/programs/communication.jpg',
    detail: defaultDetail(
      'Communications',
      'Skills',
      'Topics:',
      '',
      'Effective workplace communication\nActive listening and feedback\nProfessional writing and presentation habits',
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
      'Excellence',
      'Topics:',
      '',
      'Service mindset and ownership\nClient care conversations\nPractical issue resolution',
    ),
  },
  {
    slug: 'emotional-intelligence-well-being',
    title: 'Emotional Intelligence & Well-being',
    summary: 'Build self-awareness, resilience, empathy, and healthier workplace habits.',
    accent: '#7fb36d',
    image: '/images/programs/emotional-intelligence.jpg',
    detail: defaultDetail(
      'Emotional Intelligence',
      '& Well-being',
      'Topics:',
      '',
      'Self-awareness and empathy\nResilience in the workplace\nHealthy team behaviors',
    ),
  },
  {
    slug: 'interpersonal',
    title: 'Interpersonal',
    summary: 'Improve collaboration, trust-building, feedback, and professional relationships.',
    accent: '#9b8de3',
    image: '/images/programs/interpersonal.jpg',
    detail: defaultDetail(
      'Interpersonal',
      'Skills',
      'Topics:',
      '',
      '15 Ways to Develop and Maintain a Positive Attitude at Work *Upcoming training\nImportant Conflict Resolution Skills in the Workplace *Upcoming training',
    ),
  },
  {
    slug: 'leadership',
    title: 'Leadership',
    summary: 'Develop decision-making, coaching, accountability, and team leadership habits.',
    accent: '#65c29b',
    image: '/images/programs/leadership.jpg',
    detail: defaultDetail(
      'Leadership',
      'Development',
      'Topics:',
      '',
      'Module 1: Foundations: Manager vs Leader\nModule 2: Madison 88 Style of Leadership\nModule 3: Governing\nModule 4: Upskilling\nModule 5: Inspiring\nModule 6: Delivering\nModule 7: Elevating\nModule 8: Our Next Steps: Strategic Mindshift & Forward Momentum',
    ),
  },
  {
    slug: 'problem-solving-critical-thinking',
    title: 'Problem-Solving & Critical Thinking',
    summary: 'Apply structured thinking to analyze challenges and make stronger decisions.',
    accent: '#e77979',
    image: '/images/programs/problem-solving.jpg',
    detail: defaultDetail(
      'Problem-Solving & Critical Thinking',
      'Skills',
      'Topics:',
      '',
      'Structured problem analysis\nRoot cause thinking\nDecision-making frameworks',
    ),
  },
  {
    slug: 'productivity-mindfulness',
    title: 'Productivity & Mindfulness',
    summary: 'Improve focus, prioritization, time management, and sustainable performance.',
    accent: '#d7a85b',
    image: '/images/programs/productivity-mindfulness.jpg',
    detail: defaultDetail(
      'Productivity',
      '& Mindfulness',
      'Topics:',
      '',
      'Focus and prioritization\nTime management habits\nSustainable performance routines',
    ),
  },
];

export function getProgramBySlug(slug: string | undefined) {
  return programs.find((program) => program.slug === slug);
}
