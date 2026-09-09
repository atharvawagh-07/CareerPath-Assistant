import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, GraduationCap, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { login, register, loginAsStudent, loginAsAdmin } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(defaultMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate Junior (Year 3)');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setSuccess('Logged in successfully!');
      } else {
        await register({
          name,
          email,
          password,
          educationLevel,
          institution
        });
        setSuccess('Account created successfully!');
      }
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoStudent = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAsStudent();
      setSuccess('Logged in as Student (Alex Mercer)!');
      setTimeout(onClose, 400);
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginAsAdmin();
      setSuccess('Logged in as System Administrator!');
      setTimeout(onClose, 400);
    } catch (err: any) {
      setError(err.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            {isLogin ? 'Welcome back to CareerPath' : 'Start Your Career Journey'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {isLogin
              ? 'Access your personalized roadmaps, assessments, and readiness score'
              : 'Join thousands of students mapping clear paths to fulfilling careers'}
          </p>
        </div>

        {/* Quick Demo Credentials Bar */}
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/70 p-3">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-blue-800">
            One-Click Instant Preview Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoStudent}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-2xs hover:bg-blue-50 transition-colors"
            >
              <span>🎓 Student Demo</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-50 transition-colors"
            >
              <span>⚙️ Admin Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Full Name
              </label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@careerpath.edu"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Current Education Level
                </label>
                <select
                  value={educationLevel}
                  onChange={e => setEducationLevel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="High School Senior">High School Senior</option>
                  <option value="Undergraduate Freshman (Year 1)">Undergraduate Freshman (Year 1)</option>
                  <option value="Undergraduate Sophomore (Year 2)">Undergraduate Sophomore (Year 2)</option>
                  <option value="Undergraduate Junior (Year 3)">Undergraduate Junior (Year 3)</option>
                  <option value="Undergraduate Senior (Year 4)">Undergraduate Senior (Year 4)</option>
                  <option value="Master's / Graduate Student">Master's / Graduate Student</option>
                  <option value="Recent Graduate / Career Changer">Recent Graduate / Career Changer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  School / University (Optional)
                </label>
                <div className="relative mt-1">
                  <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    placeholder="University of Technology"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In to Account' : 'Create Free Student Profile'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          {isLogin ? (
            <span>
              Don't have an account yet?{' '}
              <button
                onClick={() => { setIsLogin(false); setError(null); }}
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign up for free
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                onClick={() => { setIsLogin(true); setError(null); }}
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
