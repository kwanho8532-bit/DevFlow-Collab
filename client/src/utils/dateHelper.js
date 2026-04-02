// utils/priorityHelper.js
import dayjs from 'dayjs';

export const getPriority = (deadline) => {
    if (!deadline) return { diffDays, label: 'No Limit', color: '#9E9E9E' };

    const now = dayjs().startOf('day');
    const target = dayjs(deadline).startOf('day');

    // 이제 27일(00시) - 26일(00시) = 정확히 1일이 나옵니다.
    const diffDays = target.diff(now, 'day');
    if (diffDays < 0) return { diffDays, label: 'OVERDUE', color: '#8B0000' };
    if (diffDays <= 3) return { diffDays, label: 'URGENT', color: '#EF4444' };
    if (diffDays <= 7) return { diffDays, label: 'HIGH', color: '#F59E0B' };
    if (diffDays <= 14) return { diffDays, label: 'MEDIUM', color: '#3B82F6' };
    return { diffDays, label: 'LOW', color: '#06B6D4' };

};

export const isDeadlinePassed = (deadline) => {
    const now = dayjs()
    const targetDate = dayjs(deadline)

    return targetDate.isBefore(now)
}