import type { FeedbackFormDraft } from '@/types/feedback';

export const feedbackFormDraftMap: Record<string, FeedbackFormDraft> = {
  'F-001': {
    id: 'F-001',
    title: 'Pantry Feedback',
    description: 'Collect always-open suggestions for pantry supplies, snacks, and drink restocking.',
    status: 'enabled',
    startAt: Date.parse('2026-04-01'),
    endAt: null,
    tags: ['Always open', 'Office'],
    estimatedMinutes: 2,
    questions: [
      {
        id: 'F-001-Q1',
        title: 'What pantry items should we add next month?',
        description: 'List snacks, drinks, or supplies that would be most helpful.',
        type: 'text',
        required: true,
        options: []
      },
      {
        id: 'F-001-Q2',
        title: 'How satisfied are you with pantry restocking frequency?',
        description: '',
        type: 'star',
        required: true,
        options: []
      },
      {
        id: 'F-001-Q3',
        title: 'Which categories matter most to you?',
        description: '',
        type: 'multipleChoice',
        required: true,
        options: [
          { id: 'F-001-Q3-O1', label: 'Healthy snacks' },
          { id: 'F-001-Q3-O2', label: 'Coffee and tea' },
          { id: 'F-001-Q3-O3', label: 'Instant meals' },
          { id: 'F-001-Q3-O4', label: 'Office supplies' }
        ]
      }
    ]
  },
  'F-002': {
    id: 'F-002',
    title: 'Team Building Survey',
    description: 'Gather activity ideas, food preferences, and transport constraints for next month team building.',
    status: 'enabled',
    startAt: Date.parse('2026-04-10'),
    endAt: Date.parse('2026-04-30'),
    tags: ['Event', 'HR'],
    estimatedMinutes: 4,
    questions: [
      {
        id: 'F-002-Q1',
        title: 'Which activity would you most likely join?',
        description: '',
        type: 'singleChoice',
        required: true,
        options: [
          { id: 'F-002-Q1-O1', label: 'Bowling' },
          { id: 'F-002-Q1-O2', label: 'Escape room' },
          { id: 'F-002-Q1-O3', label: 'Cooking class' }
        ]
      },
      {
        id: 'F-002-Q2',
        title: 'What food preferences should we consider?',
        description: '',
        type: 'multipleChoice',
        required: false,
        options: [
          { id: 'F-002-Q2-O1', label: 'Vegetarian' },
          { id: 'F-002-Q2-O2', label: 'Halal' },
          { id: 'F-002-Q2-O3', label: 'No seafood' },
          { id: 'F-002-Q2-O4', label: 'No spicy food' }
        ]
      },
      {
        id: 'F-002-Q3',
        title: 'Anything else we should know for planning?',
        description: '',
        type: 'text',
        required: false,
        options: []
      }
    ]
  },
  'F-003': {
    id: 'F-003',
    title: 'Quarterly Manager Feedback',
    description: 'Internal upward feedback for team leads with anonymity enabled by default.',
    status: 'enabled',
    startAt: Date.parse('2026-05-01'),
    endAt: Date.parse('2026-05-15'),
    tags: ['Confidential', 'Leadership'],
    estimatedMinutes: 6,
    questions: [
      {
        id: 'F-003-Q1',
        title: 'How clear is your manager when setting priorities?',
        description: '',
        type: 'star',
        required: true,
        options: []
      },
      {
        id: 'F-003-Q2',
        title: 'Which area should your manager improve most?',
        description: '',
        type: 'singleChoice',
        required: true,
        options: [
          { id: 'F-003-Q2-O1', label: 'Communication' },
          { id: 'F-003-Q2-O2', label: 'Feedback quality' },
          { id: 'F-003-Q2-O3', label: 'Planning and alignment' },
          { id: 'F-003-Q2-O4', label: 'Support for growth' }
        ]
      },
      {
        id: 'F-003-Q3',
        title: 'Share one suggestion for improvement.',
        description: '',
        type: 'text',
        required: true,
        options: []
      }
    ]
  },
  'F-004': {
    id: 'F-004',
    title: 'Office Environment Improvement',
    description: 'Suggestions for lighting, seating, meeting rooms, and focus areas.',
    status: 'disabled',
    startAt: Date.parse('2026-03-12'),
    endAt: null,
    tags: ['Facilities'],
    estimatedMinutes: 3,
    questions: [
      {
        id: 'F-004-Q1',
        title: 'Which office area needs the most improvement?',
        description: '',
        type: 'singleChoice',
        required: true,
        options: [
          { id: 'F-004-Q1-O1', label: 'Meeting rooms' },
          { id: 'F-004-Q1-O2', label: 'Lighting' },
          { id: 'F-004-Q1-O3', label: 'Open workspace' }
        ]
      }
    ]
  },
  'F-005': {
    id: 'F-005',
    title: 'April Lunch Vendor Vote',
    description: 'Short vote to select the preferred lunch vendor for the coming month.',
    status: 'enabled',
    startAt: Date.parse('2026-04-14'),
    endAt: Date.parse('2026-04-17'),
    tags: ['Vote', 'Culture'],
    estimatedMinutes: 1,
    questions: [
      {
        id: 'F-005-Q1',
        title: 'Which lunch vendor do you prefer?',
        description: '',
        type: 'singleChoice',
        required: true,
        options: [
          { id: 'F-005-Q1-O1', label: 'Vendor A' },
          { id: 'F-005-Q1-O2', label: 'Vendor B' },
          { id: 'F-005-Q1-O3', label: 'Vendor C' }
        ]
      },
      {
        id: 'F-005-Q2',
        title: 'Any quick comment before we finalize?',
        description: '',
        type: 'text',
        required: false,
        options: []
      }
    ]
  }
};

export function getFeedbackFormDraftById(id: string) {
  const draft = feedbackFormDraftMap[id];

  if (!draft) {
    return null;
  }

  return JSON.parse(JSON.stringify(draft)) as FeedbackFormDraft;
}
