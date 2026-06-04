export type Program = {
  slug: string;
  title: string;
  summary: string;
  accent: string;
};

export const programs: Program[] = [
  {
    slug: 'communication',
    title: 'Communication',
    summary: 'Build clearer messaging, active listening, and confident workplace conversations.',
    accent: '#69aee7',
  },
  {
    slug: 'customer-service',
    title: 'Customer Service',
    summary: 'Strengthen service mindset, client care, and practical issue resolution.',
    accent: '#f3b35b',
  },
  {
    slug: 'leadership',
    title: 'Leadership',
    summary: 'Develop decision-making, coaching, accountability, and team leadership habits.',
    accent: '#65c29b',
  },
  {
    slug: 'interpersonal',
    title: 'Interpersonal',
    summary: 'Improve collaboration, trust-building, feedback, and professional relationships.',
    accent: '#9b8de3',
  },
  {
    slug: 'ai-technology',
    title: 'AI & Technology',
    summary: 'Explore practical tools and digital skills for smarter, more adaptive work.',
    accent: '#5dbdca',
  },
  {
    slug: 'problem-solving-critical-thinking',
    title: 'Problem-solving & Critical Thinking',
    summary: 'Apply structured thinking to analyze challenges and make stronger decisions.',
    accent: '#e77979',
  },
  {
    slug: 'emotional-intelligence-well-being',
    title: 'Emotional Intelligence & Well-being',
    summary: 'Build self-awareness, resilience, empathy, and healthier workplace habits.',
    accent: '#7fb36d',
  },
  {
    slug: 'productivity-mindfulness',
    title: 'Productivity & Mindfulness',
    summary: 'Improve focus, prioritization, time management, and sustainable performance.',
    accent: '#d7a85b',
  },
];

export function getProgramBySlug(slug: string | undefined) {
  return programs.find((program) => program.slug === slug);
}
