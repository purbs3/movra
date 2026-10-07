import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Activity, 
  Menu, 
  X, 
  Calendar, 
  User, 
  ArrowRight, 
  LogOut,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOVRA_CONFIG } from '../config/movraConfig';

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

  const openWhatsApp = () => {
    const encoded = encodeURIComponent(MOVRA_CONFIG.brand.whatsappDefaultMessage);
    window.open(`https://wa.me/${MOVRA_CONFIG.brand.whatsappNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* Top Clinical Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 text-[11px] font-medium py-1.5 px-4 text-center border-b border-slate-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Now providing certified home physiotherapy visits across Patna (Kankarbagh, Boring Rd, Rajendra Nagar &amp; Bailey Rd).</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <a 
              href={`tel:${MOVRA_CONFIG.brand.supportPhone.replace(/\s+/g, '')}`} 
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-teal-400" />
              <span>Helpline: {MOVRA_CONFIG.brand.supportPhone}</span>
            </a>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <button
              onClick={openWhatsApp}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-slate-300 cursor-pointer"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp Booking</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Healthcare Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Clinical Subtitle */}
          <Link to="/" className="flex items-center gap-3.5 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-950 transition-colors">
              <Activity className="w-5 h-5 text-teal-400 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-950 tracking-tight">MOVRA</span>
                <span className="text-[11px] font-semibold text-slate-500 hidden md:inline">
                  Home Rehabilitation
                </span>
              </div>
              <p className="text-[10px] text-teal-800 font-semibold tracking-wider uppercase -mt-0.5">
                Patna Clinical Hub
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/"
              className="text-sm font-semibold text-slate-700 hover:text-teal-800 transition-colors"
            >
              Home
            </Link>
            <button 
              onClick={() => handleNavClick('services')}
              className="text-sm font-semibold text-slate-600 hover:text-teal-800 transition-colors cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="text-sm font-semibold text-slate-600 hover:text-teal-800 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('movra-intelligence')}
              className="text-sm font-semibold text-slate-600 hover:text-teal-800 transition-colors cursor-pointer"
            >
              MOVRA Intelligence
            </button>
            <button 
              onClick={() => handleNavClick('team')}
              className="text-sm font-semibold text-slate-600 hover:text-teal-800 transition-colors cursor-pointer"
            >
              Physiotherapists
            </button>
            <button 
              onClick={() => handleNavClick('pricing')}
              className="text-sm font-semibold text-slate-600 hover:text-teal-800 transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* WhatsApp Quick Action */}
            <button
              onClick={openWhatsApp}
              className="p-2.5 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200/80 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Chat with Care Coordinator on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">WhatsApp</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-teal-700" />
                  <span>{user?.full_name?.split(' ')[0] || 'User'} Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:text-teal-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => handleNavClick('booking-section')}
                  className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>Book Home Visit</span>
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
                className="text-left px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className="text-left px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="text-left px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('movra-intelligence')}
                className="text-left px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                MOVRA Intelligence
              </button>
              <button
                onClick={() => handleNavClick('team')}
                className="text-left px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Meet Your Physiotherapist
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className="text-left px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Transparent Pricing
              </button>
              <button
                onClick={() => handleNavClick('faq')}
                className="text-left px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Frequently Asked Questions
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => { setMobileMenuOpen(false); openWhatsApp(); }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Book via WhatsApp ({MOVRA_CONFIG.brand.supportPhone})</span>
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 text-center rounded-xl bg-slate-950 text-white text-xs font-bold"
                  >
                    Open Dashboard ({role})
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('booking-section')}
                    className="w-full py-3 px-4 text-center rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <span>Book Home Visit</span>
                  </button>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 text-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
                  >
                    Sign In to Patient Portal
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Body (No bottom navigation on public layout) */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Mobile Sticky Quick-Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex items-center gap-2.5 shadow-lg">
        <button
          onClick={openWhatsApp}
          className="flex-1 py-3 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>WhatsApp</span>
        </button>
        <button
          onClick={() => handleNavClick('booking-section')}
          className="flex-[2] py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-teal-400" />
          <span>Book Home Visit</span>
        </button>
      </div>
    </div>
  );
};
