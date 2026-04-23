import type { FeedbackResponseRecord } from '@/types/feedback';

export const feedbackResponsesMap: Record<string, FeedbackResponseRecord[]> = {
  'F-001': [
    {
      id: 'R-001',
      formId: 'F-001',
      submittedAt: '2026-04-15 09:20',
      submitterName: 'Alicia',
      anonymous: false,
      answers: [
        { questionId: 'F-001-Q1', value: 'Add more sugar-free drinks and fresh fruit.' },
        { questionId: 'F-001-Q2', value: 4 },
        { questionId: 'F-001-Q3', value: ['Healthy snacks', 'Coffee and tea'] }
      ]
    },
    {
      id: 'R-002',
      formId: 'F-001',
      submittedAt: '2026-04-16 14:05',
      submitterName: null,
      anonymous: true,
      answers: [
        { questionId: 'F-001-Q1', value: 'Please restock cup noodles earlier in the week.' },
        { questionId: 'F-001-Q2', value: 3 },
        { questionId: 'F-001-Q3', value: ['Instant meals', 'Office supplies'] }
      ]
    }
  ],
  'F-002': [
    {
      id: 'R-101',
      formId: 'F-002',
      submittedAt: '2026-04-17 10:00',
      submitterName: 'Marcus',
      anonymous: false,
      answers: [
        { questionId: 'F-002-Q1', value: 'Cooking class' },
        { questionId: 'F-002-Q2', value: ['Halal', 'No spicy food'] },
        { questionId: 'F-002-Q3', value: 'Friday afternoon works best for me.' }
      ]
    },
    {
      id: 'R-102',
      formId: 'F-002',
      submittedAt: '2026-04-17 11:40',
      submitterName: 'Jia Wen',
      anonymous: false,
      answers: [
        { questionId: 'F-002-Q1', value: 'Bowling' },
        { questionId: 'F-002-Q2', value: ['Vegetarian'] },
        { questionId: 'F-002-Q3', value: '' }
      ]
    },
    {
      id: 'R-103',
      formId: 'F-002',
      submittedAt: '2026-04-18 16:25',
      submitterName: null,
      anonymous: true,
      answers: [
        { questionId: 'F-002-Q1', value: 'Escape room' },
        { questionId: 'F-002-Q2', value: ['No seafood'] },
        { questionId: 'F-002-Q3', value: 'Please avoid very late evening sessions.' }
      ]
    }
  ],
  'F-003': [
    {
      id: 'R-201',
      formId: 'F-003',
      submittedAt: '2026-05-04 09:15',
      submitterName: null,
      anonymous: true,
      answers: [
        { questionId: 'F-003-Q1', value: 4 },
        { questionId: 'F-003-Q2', value: 'Planning and alignment' },
        { questionId: 'F-003-Q3', value: 'Weekly priority updates would help reduce last-minute changes.' }
      ]
    },
    {
      id: 'R-202',
      formId: 'F-003',
      submittedAt: '2026-05-05 13:30',
      submitterName: null,
      anonymous: true,
      answers: [
        { questionId: 'F-003-Q1', value: 5 },
        { questionId: 'F-003-Q2', value: 'Support for growth' },
        { questionId: 'F-003-Q3', value: 'More structured feedback on career progression would be useful.' }
      ]
    }
  ],
  'F-004': [],
  'F-005': [
    {
      id: 'R-301',
      formId: 'F-005',
      submittedAt: '2026-04-15 12:10',
      submitterName: 'Daniel',
      anonymous: false,
      answers: [
        { questionId: 'F-005-Q1', value: 'Vendor B' },
        { questionId: 'F-005-Q2', value: 'Please keep at least one healthy option.' }
      ]
    },
    {
      id: 'R-302',
      formId: 'F-005',
      submittedAt: '2026-04-15 12:45',
      submitterName: 'Siti',
      anonymous: false,
      answers: [
        { questionId: 'F-005-Q1', value: 'Vendor A' },
        { questionId: 'F-005-Q2', value: '' }
      ]
    }
  ]
};

export function getFeedbackResponsesByFormId(formId: string) {
  const responses = feedbackResponsesMap[formId] || [];

  return responses.map(item => ({
    ...item,
    answers: item.answers.map(answer => ({
      ...answer,
      value: Array.isArray(answer.value) ? [...answer.value] : answer.value
    }))
  }));
}
