import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Menu, X, LogOut, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';

const links = [
  { to: '/', label: 'Home' },
  { to: '/map', label: 'Map' },
  { to: '/report', label: 'Report Issue' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/about', label: 'About' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400 text-navy-950">
            <MapPin size={18} />
          </span>
          <span className="text-lg tracking-tight">UrbanFix</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'text-teal-300' : 'text-white/70 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'text-teal-300' : 'text-white/70 hover:text-white'
                }`
              }
            >
              <ShieldCheck size={15} /> Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-white/70">
                Hi, <span className="text-white">{user.name.split(' ')[0]}</span>
              </span>
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-1.5 text-sm">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-4 !py-1.5 text-sm">
                Login
              </Link>
              <Link to="/signup" className="btn-primary !px-4 !py-1.5 text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="text-white md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy-950 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-teal-400/10 text-teal-300' : 'text-white/70'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-white/70"
              >
                Admin
              </NavLink>
            )}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              {user ? (
                <button onClick={handleLogout} className="btn-secondary w-full text-sm">
                  <LogOut size={15} /> Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary w-full text-sm">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary w-full text-sm">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
