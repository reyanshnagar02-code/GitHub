import { STATUS_COLORS, URGENCY_COLORS } from '../constants.js';

export function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Reported;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${colors.text} ${colors.bg} ${colors.border}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
      {status}
    </span>
  );
}

export function UrgencyBadge({ urgency }) {
  const classes = URGENCY_COLORS[urgency] || URGENCY_COLORS.Medium;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}>
      {urgency} urgency
    </span>
  );
}

export function pinColor(status) {
  if (status === 'Resolved') return '#4ade80';
  if (status === 'In Progress') return '#facc15';
  return '#f87171';
}
