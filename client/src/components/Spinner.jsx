import { Loader2 } from 'lucide-react';

export function Spinner({ size = 18, className = '' }) {
  return <Loader2 size={size} className={`animate-spin ${className}`} />;
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner size={32} className="text-teal-400" />
    </div>
  );
}
