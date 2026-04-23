import dayjs from 'dayjs';
import { $t } from '@/locales';
import type { FeedbackFormRecord } from '@/types/feedback';

export type FeedbackDisplayState = 'disabled' | 'upcoming' | 'ongoing' | 'endingSoon' | 'expired';

export function getFeedbackDisplayState(record: FeedbackFormRecord): FeedbackDisplayState {
  if (record.status === 'disabled') {
    return 'disabled';
  }

  const now = dayjs();
  const startAt = dayjs(record.startAt).startOf('day');

  if (now.isBefore(startAt)) {
    return 'upcoming';
  }

  if (!record.endAt) {
    return 'ongoing';
  }

  const endAt = dayjs(record.endAt).endOf('day');

  if (now.isAfter(endAt)) {
    return 'expired';
  }

  const diffDays = endAt.diff(now, 'day', true);

  if (diffDays <= 2) {
    return 'endingSoon';
  }

  return 'ongoing';
}

export function getFeedbackDisplayStateMeta(state: FeedbackDisplayState) {
  const stateMap: Record<
    FeedbackDisplayState,
    { label: string; type: 'default' | 'info' | 'success' | 'warning' | 'error' }
  > = {
    disabled: { label: $t('page.feedback.shared.state.disabled'), type: 'default' },
    upcoming: { label: $t('page.feedback.shared.state.upcoming'), type: 'info' },
    ongoing: { label: $t('page.feedback.shared.state.ongoing'), type: 'success' },
    endingSoon: { label: $t('page.feedback.shared.state.endingSoon'), type: 'warning' },
    expired: { label: $t('page.feedback.shared.state.expired'), type: 'error' }
  };

  return stateMap[state];
}

export function formatFeedbackDateRange(record: FeedbackFormRecord) {
  if (!record.endAt) {
    return `${dayjs(record.startAt).format('YYYY-MM-DD')} ~ ${$t('page.feedback.shared.date.alwaysOpen')}`;
  }

  return `${dayjs(record.startAt).format('YYYY-MM-DD')} ~ ${dayjs(record.endAt).format('YYYY-MM-DD')}`;
}

export function getFeedbackCountDownText(record: FeedbackFormRecord) {
  if (!record.endAt) {
    return $t('page.feedback.shared.availability.permanent');
  }

  const diff = dayjs(record.endAt).endOf('day').diff(dayjs(), 'day');

  if (diff < 0) {
    return $t('page.feedback.shared.state.expired');
  }

  if (diff === 0) {
    return $t('page.feedback.shared.availability.endsToday');
  }

  return $t('page.feedback.shared.availability.daysLeft', { count: diff });
}
