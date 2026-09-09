import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Roadmap, Career } from '../types';
import { api } from '../services/api';

export const RoadmapsPage: React.FC = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [availableCareers, setAvailableCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingForCareer, setCreatingForCareer] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [rmRes, crRes] = await Promise.all([
          api.getRoadmaps(),
          api.getCareers({ limit: '50' })
        ]);
        setRoadmaps(rmRes.roadmaps);
        setAvailableCareers(crRes.careers);
      } catch (err) {
        console.error('Failed to load roadmaps:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatingForCareer) return;
    setCreating(true);
    try {
      const res = await api.generateRoadmap(creatingForCareer);
      navigate(`/roadmaps/${res.roadmapId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to generate roadmap.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRoadmap = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this roadmap?')) return;
    try {
      await api.deleteRoadmap(id);
      setRoadmaps(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert('Failed to delete roadmap.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">Loading your learning roadmaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Structured Execution</span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Personalized Career Roadmaps
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Track phase-by-phase learning milestones, project deliverables, and verified skill acquisition.
          </p>
        </div>
      </div>

      {/* New Roadmap Generator Card */}
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-900 to-indigo-900 p-6 sm:p-8 text-white mb-10 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 backdrop-blur-xs mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Automated Curriculum Generator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Launch a New Career Mastery Plan</h2>
            <p className="mt-1 text-xs sm:text-sm text-blue-100">
              Select any of our 50+ career paths to generate a customized 5-stage milestone roadmap with curated projects and study resources.
            </p>
          </div>

          <form onSubmit={handleCreateRoadmap} className="flex flex-col sm:flex-row gap-3 shrink-0">
            <select
              value={creatingForCareer}
              onChange={e => setCreatingForCareer(e.target.value)}
              required
              className="rounded-xl border border-blue-300/40 bg-white/10 px-4 py-2.5 text-xs text-white placeholder-blue-200 backdrop-blur-xs focus:bg-slate-900 focus:outline-hidden"
            >
              <option value="" className="text-slate-900">Choose Career Target...</option>
              {availableCareers.map(c => (
                <option key={c.id} value={c.id} className="text-slate-900">
                  {c.title} ({c.category})
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={creating || !creatingForCareer}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-blue-900 shadow-xs hover:bg-blue-50 transition disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>{creating ? 'Generating...' : 'Generate Roadmap'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Active Roadmaps List */}
      {roadmaps.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-800">No active roadmaps created yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Choose a target career above or take the 30-question assessment to generate your personalized action plan.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/assessment"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
            >
              Take Assessment First
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map(rm => {
            const completedCount = rm.steps ? rm.steps.filter(s => s.completed).length : 0;
            const totalSteps = rm.steps ? rm.steps.length : 5;

            return (
              <div
                key={rm.id}
                onClick={() => navigate(`/roadmaps/${rm.id}`)}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                      {rm.career_category || 'Technology'}
                    </span>
                    <button
                      onClick={e => handleDeleteRoadmap(rm.id, e)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete roadmap"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {rm.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    Target: {rm.career_title || 'Software Specialist'}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                      <span>Curriculum Progress</span>
                      <span className="text-blue-600">{rm.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${rm.progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400">
                      {completedCount} of {totalSteps} milestone phases achieved
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    5-Stage Learning Path
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Open Roadmap</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
