import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Search,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Resource } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ResourcesPage: React.FC = () => {
  const { savedResourceIds, toggleResourceBookmark } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [isFree, setIsFree] = useState('All');

  const categories = ['All', 'Courses', 'Certifications', 'Books', 'Practice & Sandboxes', 'Documentation'];

  useEffect(() => {
    async function loadResources() {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (search.trim()) params.search = search.trim();
        if (category !== 'All') params.category = category;
        if (difficulty !== 'All') params.difficulty = difficulty;
        if (isFree !== 'All') params.isFree = isFree;

        const res = await api.getResources(params);
        setResources(res.resources);
      } catch (err) {
        console.error('Failed to load resources:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, [search, category, difficulty, isFree]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Curated Knowledge</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          50+ Verified Educational Resources
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Carefully vetted courses, industry certifications, books, and interactive sandboxes designed to accelerate your foundational and specialized mastery.
        </p>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resources..."
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
              <option value="All">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <select
              value={isFree}
              onChange={e => setIsFree(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs sm:text-sm text-slate-900 outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Pricing Types</option>
              <option value="true">100% Free Resources</option>
              <option value="false">Paid / Certifications</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-56 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">No resources match your filters</h3>
          <button
            onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All'); setIsFree('All'); }}
            className="mt-3 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map(res => {
            const isSaved = savedResourceIds.has(res.id);

            return (
              <div
                key={res.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                      {res.provider}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        res.is_free ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {res.is_free ? 'Free' : 'Certification'}
                      </span>
                      <button
                        onClick={() => toggleResourceBookmark(res.id)}
                        title={isSaved ? 'Remove bookmark' : 'Bookmark resource'}
                        className={`rounded-lg p-1.5 transition ${
                          isSaved ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {res.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span>Format: <strong>{res.category}</strong></span>
                    <span>•</span>
                    <span>Level: <strong>{res.difficulty}</strong></span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Verified Course
                  </span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
