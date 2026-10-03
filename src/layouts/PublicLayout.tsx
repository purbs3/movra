import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Menu, 
  X, 
  Calendar, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  LogOut,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'physiotherapist') return '/physio-dashboard';
    return '/dashboard';
  };

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-teal-100 selection:text-teal-900">
      {/* Premium Glassmorphic Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">MOVRA</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/60 tracking-wider">
                  AI Physio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block -mt-0.5">
                Movement &amp; Rehabilitation Care
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => handleNavClick('services')}
              className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('team')}
              className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              Clinical Team
            </button>
            <button 
              onClick={() => handleNavClick('booking-section')}
              className="text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              Coverage Areas
            </button>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold hover:bg-teal-100 transition-colors flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-teal-700" />
                  <span>{user?.full_name?.split(' ')[0] || 'My'} Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-teal-800 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => handleNavClick('booking-section')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white text-xs font-bold shadow-md shadow-teal-900/15 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Visit</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleNavClick('services')}
                className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('team')}
                className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Clinical Team
              </button>
              <button
                onClick={() => handleNavClick('booking-section')}
                className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Home Visit Booking
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center rounded-xl bg-teal-700 text-white text-xs font-bold"
                  >
                    Open Clinical Workspace
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={() => handleNavClick('booking-section')}
                    className="w-full py-2.5 px-4 text-center rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm"
                  >
                    Book Home Visit
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content (NO Bottom Navigation ever rendered here) */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};
