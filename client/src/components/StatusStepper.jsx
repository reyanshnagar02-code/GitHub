import { Check } from 'lucide-react';
import { STATUSES } from '../constants.js';

export function StatusStepper({ status }) {
  const currentIndex = STATUSES.indexOf(status);

  return (
    <div className="flex items-center">
      {STATUSES.map((step, idx) => {
        const done = idx < currentIndex;
        const active = idx === currentIndex;
        const isLast = idx === STATUSES.length - 1;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition
                  ${
                    done
                      ? 'border-teal-400 bg-teal-400 text-navy-950'
                      : active
                      ? 'border-teal-400 bg-navy-950 text-teal-300'
                      : 'border-white/20 bg-navy-950 text-white/40'
                  }`}
              >
                {done ? <Check size={14} /> : idx + 1}
              </div>
              <span
                className={`text-center text-[11px] leading-tight ${
                  active || done ? 'text-teal-300' : 'text-white/40'
                }`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div className={`mx-1 h-0.5 flex-1 rounded ${done ? 'bg-teal-400' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
