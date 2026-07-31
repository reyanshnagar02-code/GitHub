export const CATEGORIES = ['Infrastructure', 'Lighting', 'Sanitation', 'Safety', 'Furniture', 'Other'];

export const URGENCY_LEVELS = ['Low', 'Medium', 'High'];

export const STATUSES = ['Reported', 'Acknowledged', 'In Progress', 'Resolved'];

export const STATUS_COLORS = {
  Reported: { dot: '#f87171', text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
  Acknowledged: { dot: '#f87171', text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
  'In Progress': { dot: '#facc15', text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  Resolved: { dot: '#4ade80', text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
};

export const URGENCY_COLORS = {
  Low: 'text-sky-300 bg-sky-400/10 border-sky-400/30',
  Medium: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
  High: 'text-rose-300 bg-rose-400/10 border-rose-400/30',
};

export const BADGE_THRESHOLDS = { Gold: 150, Silver: 50 };

export const BADGE_COLORS = {
  Gold: 'text-yellow-300 bg-yellow-400/10 border-yellow-400/30',
  Silver: 'text-slate-200 bg-slate-300/10 border-slate-300/30',
  Bronze: 'text-orange-300 bg-orange-400/10 border-orange-400/30',
};

export const DEFAULT_CENTER = [42.2808, -83.743];
