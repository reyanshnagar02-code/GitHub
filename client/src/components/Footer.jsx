import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-white/80">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-400 text-navy-950">
            <MapPin size={13} />
          </span>
          <span className="text-sm font-semibold">UrbanFix</span>
        </Link>
        <p className="text-xs text-white/40">Report it. Track it. Fix your campus/city.</p>
        <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} UrbanFix</p>
      </div>
    </footer>
  );
}
