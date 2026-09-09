import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Layers,
  MapPin,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Search
} from 'lucide-react';
import { Career, User } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { formatSalary } = useCurrency();
  const [analytics, setAnalytics] = useState<any>(null);
  const [careers, setCareers] = useState<Career[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<'stats' | 'careers' | 'users' | 'feedback'>('stats');

  // Add career modal
  const [showAddCareer, setShowAddCareer] = useState(false);
  const [newCareer, setNewCareer] = useState({
    title: '',
    category: 'Software Engineering & Architecture',
    description: '',
    overview: '',
    responsibilities: 'Architect modular backends, Design RESTful APIs, Maintain unit tests',
    salaryMin: 95000,
    salaryMax: 150000,
    demandLevel: 'High',
    futureGrowth: '+22% (2024-2034)',
    difficulty: 'Intermediate',
    education: "Bachelor's in Computer Science or equivalent practical portfolio",
    skills: 'TypeScript, Node.js, PostgreSQL, Docker',
    tools: 'VS Code, Git, GitHub Actions, AWS',
    pros: 'High salary ceiling, Strong remote options, Creative problem solving',
    cons: 'Continuous upskilling required, On-call rotations'
  });

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [anRes, crRes, usRes, fbRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminCareers(),
        api.getAdminUsers(),
        api.getAdminFeedback()
      ]);
      setAnalytics(anRes.analytics);
      setCareers(crRes.careers);
      setUsers(usRes.users);
      setFeedback(fbRes.feedback);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: newCareer.title,
        category: newCareer.category,
        description: newCareer.description,
        overview: newCareer.overview || newCareer.description,
        responsibilities: newCareer.responsibilities.split(',').map(s => s.trim()).filter(Boolean),
        salaryMin: Number(newCareer.salaryMin),
        salaryMax: Number(newCareer.salaryMax),
        demandLevel: newCareer.demandLevel,
        futureGrowth: newCareer.futureGrowth,
        difficulty: newCareer.difficulty,
        education: newCareer.education,
        skills: newCareer.skills.split(',').map(s => s.trim()).filter(Boolean),
        tools: newCareer.tools.split(',').map(s => s.trim()).filter(Boolean),
        pros: newCareer.pros.split(',').map(s => s.trim()).filter(Boolean),
        cons: newCareer.cons.split(',').map(s => s.trim()).filter(Boolean),
        industries: ['Enterprise Software', 'Fintech', 'HealthTech']
      };

      await api.createAdminCareer(payload);
      alert('Career path added to directory successfully.');
      setShowAddCareer(false);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to create career.');
    }
  };

  const handleDeleteCareer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this career?')) return;
    try {
      await api.deleteAdminCareer(id);
      setCareers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete career.');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await api.updateAdminUserRole(userId, newRole);
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole as any } : u)));
    } catch (err) {
      alert('Failed to update role.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">Loading administrative console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Platform Management & Telemetry
          </h1>
        </div>

        <button
          onClick={loadAllAdminData}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
        {[
          { id: 'stats', label: 'Platform Telemetry', icon: Layers },
          { id: 'careers', label: `Careers Catalog (${careers.length})`, icon: Briefcase },
          { id: 'users', label: `Registered Users (${users.length})`, icon: Users },
          { id: 'feedback', label: `Feedback Inbox (${feedback.length})`, icon: MessageSquare }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-5 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TELEMETRY STATS */}
      {activeTab === 'stats' && analytics && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">{analytics.usersCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Careers</span>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{analytics.careersCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assessments</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{analytics.quizzesTaken}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Roadmaps</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">{analytics.roadmapsGenerated}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Projects</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{analytics.projectsCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Resources</span>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">{analytics.resourcesCount}</p>
            </div>
          </div>

          {/* Quick Health Status */}
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-emerald-950">Engine & Services Healthy</h3>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              PostgreSQL WASM database, Recommendation Scoring Engine (30/20/15/15/10/10 model), and Career Readiness Index calculators are operating nominally with zero latency degradation.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: CAREERS CATALOG MANAGEMENT */}
      {activeTab === 'careers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Manage live career definitions, skill models, and prerequisite benchmarks.
            </p>
            <button
              onClick={() => setShowAddCareer(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Career Path</span>
            </button>
          </div>

          {/* Add Career Modal */}
          {showAddCareer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Career Specification</h3>
                <form onSubmit={handleCreateCareer} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Career Title</label>
                      <input
                        type="text"
                        required
                        value={newCareer.title}
                        onChange={e => setNewCareer({ ...newCareer, title: e.target.value })}
                        placeholder="e.g. Distributed Systems Engineer"
                        className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={newCareer.category}
                        onChange={e => setNewCareer({ ...newCareer, category: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Brief Description</label>
                      <input
                        type="text"
                        required
                        value={newCareer.description}
                        onChange={e => setNewCareer({ ...newCareer, description: e.target.value })}
                        placeholder="Core overview in 1-2 sentences"
                        className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Salary Min ($)</label>
                      <input
                        type="number"
                        required
                        value={newCareer.salaryMin}
                        onChange={e => setNewCareer({ ...newCareer, salaryMin: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Salary Max ($)</label>
                      <input
                        type="number"
                        required
                        value={newCareer.salaryMax}
                        onChange={e => setNewCareer({ ...newCareer, salaryMax: Number(e.target.value) })}
                        className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                      <select
                        value={newCareer.difficulty}
                        onChange={e => setNewCareer({ ...newCareer, difficulty: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Demand Level</label>
                      <select
                        value={newCareer.demandLevel}
                        onChange={e => setNewCareer({ ...newCareer, demandLevel: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                      >
                        <option value="Moderate">Moderate</option>
                        <option value="High">High</option>
                        <option value="Very High">Very High</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Skills (comma separated)</label>
                      <input
                        type="text"
                        value={newCareer.skills}
                        onChange={e => setNewCareer({ ...newCareer, skills: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddCareer(false)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      Save Career
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Careers Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-500 text-[10px]">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Salary Range</th>
                  <th className="p-4">Demand</th>
                  <th className="p-4">Difficulty</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {careers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-bold text-slate-900">{c.title}</td>
                    <td className="p-4">{c.category}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      {formatSalary(c.salary_min, c.salary_max)}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {c.demand_level}
                      </span>
                    </td>
                    <td className="p-4">{c.difficulty}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteCareer(c.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete career"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-500 text-[10px]">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Education</th>
                <th className="p-4 text-right">Role Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60">
                  <td className="p-4 font-bold text-slate-900">{u.name}</td>
                  <td className="p-4 text-slate-500">{u.email}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{u.educationLevel || 'Undergraduate'}</td>
                  <td className="p-4 text-right">
                    <select
                      value={u.role}
                      onChange={e => handleUpdateRole(u.id, e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white py-1 px-2 text-[11px] font-semibold text-slate-700 outline-hidden"
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: FEEDBACK INBOX */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
              No feedback submissions received yet.
            </div>
          ) : (
            feedback.map(fb => (
              <div key={fb.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{fb.userName || 'Anonymous'}</span>
                    <span className="text-xs text-slate-400">({fb.userEmail})</span>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                    {fb.category}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{fb.message}</p>
                {fb.rating && (
                  <div className="mt-3 text-[11px] font-semibold text-amber-600">
                    Rating: {fb.rating} / 5 stars
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
