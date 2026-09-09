import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FolderGit2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Code,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Project } from '../types';
import { api } from '../services/api';

export const ProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const categories = ['All', 'AI & Machine Learning', 'Full-Stack Development', 'Cloud & DevOps', 'Cybersecurity', 'Data Engineering', 'Systems & Architecture'];

  // Sync state when URL params change
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'All';
    const urlDifficulty = searchParams.get('difficulty') || 'All';

    if (urlSearch !== search) setSearch(urlSearch);
    if (urlCategory !== category) setCategory(urlCategory);
    if (urlDifficulty !== difficulty) setDifficulty(urlDifficulty);
  }, [searchParams]);

  // Sync active filters to URL search parameters
  useEffect(() => {
    const nextParams: Record<string, string> = {};
    if (search.trim()) nextParams.search = search.trim();
    if (category !== 'All') nextParams.category = category;
    if (difficulty !== 'All') nextParams.difficulty = difficulty;

    setSearchParams(nextParams, { replace: true });
  }, [search, category, difficulty, setSearchParams]);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (category !== 'All') params.category = category;
        if (difficulty !== 'All') params.difficulty = difficulty;

        const res = await api.getProjects(params);
        setProjects(res.projects);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [search, category, difficulty]);

  const handleUpdateStatus = async (projectId: string, newStatus: string) => {
    setUpdatingId(projectId);
    const prog = newStatus === 'COMPLETED' ? 100 : newStatus === 'IN_PROGRESS' ? 50 : 0;
    try {
      await api.updateProjectProgress(projectId, newStatus, prog);
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, userStatus: newStatus as any, userProgress: prog } : p))
      );
    } catch (err) {
      alert('Failed to update project progress.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Practical Craftsmanship</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          50+ Portfolio Capstone Projects
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Recruiters look for verifiable execution over certifications. Complete these production-grade projects to demonstrate practical mastery.
        </p>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects by title, tech, or skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs sm:text-sm text-slate-900 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs sm:text-sm text-slate-900 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <FolderGit2 className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">No projects match your filter</h3>
          <button
            onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All'); }}
            className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(proj => {
            const isCompleted = proj.userStatus === 'COMPLETED';
            const isInProgress = proj.userStatus === 'IN_PROGRESS';

            return (
              <div
                key={proj.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                      {proj.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <Clock className="h-3 w-3" />
                      {proj.duration}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {proj.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech stack */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Technologies
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Key Deliverables
                    </span>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {proj.deliverables.slice(0, 2).map((d, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-blue-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Status Tracker Bar */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      ★ {proj.portfolio_value} Portfolio Value
                    </span>
                    <select
                      value={proj.userStatus || 'NOT_STARTED'}
                      onChange={e => handleUpdateStatus(proj.id, e.target.value)}
                      disabled={updatingId === proj.id}
                      className={`rounded-lg py-1 px-2 text-xs font-semibold outline-hidden transition ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <option value="NOT_STARTED">Not Started</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">✓ Completed</option>
                    </select>
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
