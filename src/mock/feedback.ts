import type { FeedbackFormRecord } from '@/types/feedback';

export const initialFeedbackForms: FeedbackFormRecord[] = [
  {
    id: 'F-001',
    title: 'Pantry Feedback',
    description: 'Collect always-open suggestions for pantry supplies, snacks, and drink restocking.',
    status: 'enabled',
    caseType: 'normal',
    startAt: '2026-04-01',
    endAt: null,
    questionCount: 5,
    estimatedMinutes: 2,
    responseCount: 48,
    tags: ['Always open', 'Office']
  },
  {
    id: 'F-002',
    title: 'Team Building Survey',
    description: 'Gather activity ideas, food preferences, and transport constraints for next month team building.',
    status: 'enabled',
    caseType: 'special',
    startAt: '2026-04-10',
    endAt: '2026-04-30',
    questionCount: 8,
    estimatedMinutes: 4,
    responseCount: 23,
    tags: ['Event', 'HR']
  },
  {
    id: 'F-003',
    title: 'Quarterly Manager Feedback',
    description: 'Internal upward feedback for team leads with anonymity enabled by default.',
    status: 'enabled',
    caseType: 'special',
    startAt: '2026-05-01',
    endAt: '2026-05-15',
    questionCount: 10,
    estimatedMinutes: 6,
    responseCount: 0,
    tags: ['Confidential', 'Leadership']
  },
  {
    id: 'F-004',
    title: 'Office Environment Improvement',
    description: 'Suggestions for lighting, seating, meeting rooms, and focus areas.',
    status: 'disabled',
    caseType: 'normal',
    startAt: '2026-03-12',
    endAt: null,
    questionCount: 6,
    estimatedMinutes: 3,
    responseCount: 12,
    tags: ['Facilities']
  },
  {
    id: 'F-005',
    title: 'April Lunch Vendor Vote',
    description: 'Short vote to select the preferred lunch vendor for the coming month.',
    status: 'enabled',
    caseType: 'special',
    startAt: '2026-04-14',
    endAt: '2026-04-17',
    questionCount: 3,
    estimatedMinutes: 1,
    responseCount: 31,
    tags: ['Vote', 'Culture']
  }
];

export function createFeedbackFormRecords() {
  return initialFeedbackForms.map(item => ({ ...item, tags: [...item.tags] }));
}
