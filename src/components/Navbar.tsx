import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  BookOpen,
  GitCompare,
  MapPin,
  FolderGit2,
  Bookmark,
  Award,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useCurrency } from '../context/CurrencyContext';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const { user, logout, loginAsStudent, loginAsAdmin } = useAuth();
  const { selectedCareers } = useCompare();
  const { currency, toggleCurrency, setCurrency } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Discover', path: '/', icon: Compass },
    { name: 'Assessment', path: '/assessment', icon: Sparkles },
    { name: 'Explore Careers', path: '/careers', icon: BookOpen },
    {
      name: 'Compare',
      path: '/compare',
      icon: GitCompare,
      badge: selectedCareers.length > 0 ? selectedCareers.length : null
    },
    { name: 'Roadmaps', path: '/roadmaps', icon: MapPin },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Resources', path: '/resources', icon: Bookmark },
    { name: 'Readiness', path: '/readiness', icon: Award }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Career<span className="text-blue-600">Path</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Orientation & Roadmaps
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                  {link.badge !== null && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Account / Auth Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Currency Switcher Toggle */}
            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100/80 p-1 text-xs font-semibold hover:border-slate-300 transition-all shadow-2xs"
              title={`Switch currency between Indian Rupee (₹) and US Dollar ($). Currently: ${currency === 'INR' ? '₹ INR' : '$ USD'}`}
              aria-label="Toggle currency"
            >
              <span className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${currency === 'INR' ? 'bg-white text-emerald-700 shadow-xs ring-1 ring-emerald-600/20' : 'text-slate-500 hover:text-slate-700'}`}>
                ₹ INR
              </span>
              <span className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${currency === 'USD' ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-600/20' : 'text-slate-500 hover:text-slate-700'}`}>
                $ USD
              </span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 text-left hover:border-slate-300 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>Career Profile & Skills</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50"
                      >
                        <ShieldAlert className="h-4 w-4 text-indigo-500" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="h-4 w-4 text-red-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden xl:flex items-center gap-1.5 border-r border-slate-200 pr-2">
                  <button
                    onClick={loginAsStudent}
                    className="rounded-lg px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                    title="Quick demo as Student"
                  >
                    Demo: Student
                  </button>
                  <button
                    onClick={loginAsAdmin}
                    className="rounded-lg px-2 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
                    title="Quick demo as Admin"
                  >
                    Demo: Admin
                  </button>
                </div>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {!user && (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            {/* Mobile Currency Switcher */}
            <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Display Currency:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${currency === 'INR' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 bg-white border border-slate-200'}`}
                >
                  ₹ INR (LPA)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${currency === 'USD' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 bg-white border border-slate-200'}`}
                >
                  $ USD
                </button>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                      active
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{link.name}</span>
                    </div>
                    {link.badge !== null && (
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {user ? (
                <>
                  <div className="my-2 border-t border-slate-100" />
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>My Career Profile</span>
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                    >
                      <ShieldAlert className="h-4 w-4 text-indigo-500" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    <span>Sign Out ({user.name})</span>
                  </button>
                </>
              ) : (
                <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        loginAsStudent();
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-semibold text-blue-700"
                    >
                      Demo: Student
                    </button>
                    <button
                      onClick={() => {
                        loginAsAdmin();
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 rounded-lg border border-indigo-200 bg-indigo-50 py-2 text-xs font-semibold text-indigo-700"
                    >
                      Demo: Admin
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
