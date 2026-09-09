import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  GitCompare,
  X,
  Plus,
  TrendingUp,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Bookmark,
  Share2,
  Check
} from 'lucide-react';
import { Career } from '../types';
import { api } from '../services/api';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export const ComparePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCareers, removeCareerFromCompare, clearCompare, addCareerToCompare } = useCompare();
  const { savedCareerIds, toggleCareerBookmark } = useAuth();
  const { currency, setCurrency, formatSalary } = useCurrency();

  const [allCareers, setAllCareers] = useState<Career[]>([]);
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync selectedCareers to URL search parameters
  useEffect(() => {
    if (selectedCareers.length > 0) {
      const slugs = selectedCareers.map(c => c.slug).join(',');
      setSearchParams({ careers: slugs }, { replace: true });
    } else if (searchParams.has('careers')) {
      setSearchParams({}, { replace: true });
    }
  }, [selectedCareers, setSearchParams]);

  // Load all careers and auto-populate from URL parameter
  useEffect(() => {
    async function loadAll() {
      try {
        const res = await api.getCareers({ limit: '100' });
        setAllCareers(res.careers);

        // Check if careers URL parameter exists and auto-add matching careers
        const careersParam = searchParams.get('careers');
        if (careersParam) {
          const requestedSlugs = careersParam.split(',').map(s => s.trim().toLowerCase());
          requestedSlugs.forEach(slug => {
            const matched = res.careers.find((c: Career) => c.slug.toLowerCase() === slug || c.id === slug);
            if (matched && !selectedCareers.some(sc => sc.id === matched.id)) {
              addCareerToCompare(matched);
            }
          });
        }
      } catch (err) {
        console.error('Failed to load career options for comparison:', err);
      }
    }
    loadAll();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddCareer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const careerId = e.target.value;
    if (!careerId) return;
    const found = allCareers.find(c => c.id === careerId);
    if (found) {
      addCareerToCompare(found);
    }
    setSelectedToAdd('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Decision Matrix</span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Side-by-Side Career Comparison
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Compare compensation, demand levels, required tools, and trade-offs between up to 3 paths.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${currency === 'INR' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              ₹ INR (LPA)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${currency === 'USD' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              $ USD
            </button>
          </div>

          {selectedCareers.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition shadow-2xs"
                title="Copy shareable link with selected careers"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share Matrix</span>
                  </>
                )}
              </button>

              <button
                onClick={clearCompare}
                className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Career Bar */}
      {selectedCareers.length < 3 && (
        <div className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
            <Plus className="h-4 w-4 text-blue-600" />
            <span>Add a career to compare ({selectedCareers.length}/3 slots occupied):</span>
          </div>

          <div className="w-full sm:w-72">
            <select
              value={selectedToAdd}
              onChange={handleAddCareer}
              className="w-full rounded-xl border border-blue-200 bg-white py-2 px-3 text-xs font-medium text-slate-800 shadow-xs outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select career to add...</option>
              {allCareers
                .filter(c => !selectedCareers.some(sc => sc.id === c.id))
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.category})
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}

      {selectedCareers.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <GitCompare className="mx-auto h-12 w-12 text-blue-400" />
          <h3 className="mt-4 text-lg font-bold text-slate-900">No careers currently selected</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            Choose careers from the dropdown above or explore the Career Directory and click "+ Compare".
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/careers"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              Browse Careers Directory
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[700px]">
            {selectedCareers.map(career => {
              const isSaved = savedCareerIds.has(career.id);

              return (
                <div
                  key={career.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Career Title & Actions */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-4">
                      <div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                          {career.category}
                        </span>
                        <h2 className="mt-2 text-xl font-bold text-slate-900 leading-snug">
                          {career.title}
                        </h2>
                      </div>
                      <button
                        onClick={() => removeCareerFromCompare(career.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        title="Remove from comparison"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Section 1: Financial & Demand Metrics */}
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Core Benchmarks
                      </h4>
                      <div className="rounded-2xl bg-slate-50 p-4 space-y-2.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Salary Range ({currency === 'INR' ? '₹' : '$'})</span>
                          <span className="font-bold text-slate-900">
                            {formatSalary(career.salary_min, career.salary_max)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Market Demand</span>
                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {career.demand_level}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Projected Growth</span>
                          <span className="font-semibold text-slate-900">{career.future_growth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Difficulty</span>
                          <span className="font-semibold text-slate-900">{career.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Education Prerequisite */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Education Prerequisite
                      </h4>
                      <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed">
                        {career.education}
                      </p>
                    </div>

                    {/* Section 3: Technical Skills */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Core Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {career.skills.map((sk, i) => (
                          <span key={i} className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-800">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Section 4: Industry Tools */}
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Toolsets
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {career.tools.map((t, i) => (
                          <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Section 5: Pros & Cons */}
                    <div className="space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Tradeoffs & Reality Check
                      </h4>
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-xs space-y-1">
                        <span className="font-bold text-emerald-800 block mb-1">Key Advantages:</span>
                        {career.pros.slice(0, 2).map((p, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-emerald-950">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl border border-red-100 bg-red-50/40 p-3 text-xs space-y-1">
                        <span className="font-bold text-red-800 block mb-1">Pressures & Cons:</span>
                        {career.cons.slice(0, 2).map((c, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-red-950">
                            <span className="text-red-500 font-bold">•</span>
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="mt-8 border-t border-slate-100 pt-4 flex flex-col gap-2">
                    <Link
                      to={`/careers/${career.slug}`}
                      className="w-full text-center rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                    >
                      View Full Details
                    </Link>
                    <button
                      onClick={() => toggleCareerBookmark(career.id)}
                      className={`w-full py-2 text-xs font-semibold rounded-xl border transition ${
                        isSaved ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isSaved ? '★ Bookmarked' : '☆ Bookmark Career'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
