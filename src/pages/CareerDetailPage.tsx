import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  MapPin,
  Bookmark,
  GitCompare,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  XCircle,
  FolderGit2,
  BookOpen,
  ExternalLink,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Career } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useCurrency } from '../context/CurrencyContext';

export const CareerDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { savedCareerIds, toggleCareerBookmark } = useAuth();
  const { isCareerComparing, addCareerToCompare, removeCareerFromCompare } = useCompare();
  const { currency, setCurrency, formatSalary, getSalaryBreakdown } = useCurrency();

  const urlTab = searchParams.get('tab');
  const validTabs = ['overview', 'skills', 'projects', 'resources'];
  const initialTab = (urlTab && validTabs.includes(urlTab)) ? (urlTab as any) : 'overview';

  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'projects' | 'resources'>(initialTab);

  // Sync tab with URL
  useEffect(() => {
    const currentParam = searchParams.get('tab');
    if (currentParam && validTabs.includes(currentParam) && currentParam !== activeTab) {
      setActiveTab(currentParam as any);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: 'overview' | 'skills' | 'projects' | 'resources') => {
    setActiveTab(tabId);
    if (tabId === 'overview') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ tab: tabId }, { replace: true });
    }
  };

  useEffect(() => {
    async function loadCareer() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getCareerBySlug(slug);
        setCareer(res.career);
      } catch (err) {
        console.error('Failed to load career:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCareer();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">Loading career details...</p>
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Career path not found</h2>
        <p className="mt-2 text-sm text-slate-500">The requested career path does not exist or has been relocated.</p>
        <Link
          to="/careers"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Career Directory</span>
        </Link>
      </div>
    );
  }

  const isSaved = savedCareerIds.has(career.id);
  const isComparing = isCareerComparing(career.id);

  const handleGenerateRoadmap = async () => {
    setGeneratingRoadmap(true);
    try {
      const res = await api.generateRoadmap(career.id);
      navigate(`/roadmaps/${res.roadmapId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create roadmap.');
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        to="/careers"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to all careers</span>
      </Link>

      {/* Main Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {career.category}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {career.difficulty} Entry Level
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {career.demand_level} Demand ({career.future_growth})
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {career.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {career.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={handleGenerateRoadmap}
              disabled={generatingRoadmap}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              <MapPin className="h-4 w-4" />
              <span>{generatingRoadmap ? 'Building Roadmap...' : 'Start Career Roadmap'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleCareerBookmark(career.id)}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                  isSaved
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-amber-600' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save Career'}</span>
              </button>

              <button
                onClick={() => {
                  if (isComparing) {
                    removeCareerFromCompare(career.id);
                  } else {
                    const ok = addCareerToCompare(career);
                    if (!ok) alert('You can compare a maximum of 3 careers simultaneously.');
                  }
                }}
                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition ${
                  isComparing
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <GitCompare className="h-4 w-4" />
                <span>{isComparing ? 'Comparing' : 'Compare'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Core Benchmarks Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
          <div className="group relative">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Salary Range ({currency === 'INR' ? '₹ INR' : '$ USD'})
              </p>
              <button
                type="button"
                onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 transition underline underline-offset-2"
                title="Switch currency"
              >
                {currency === 'INR' ? 'Switch to $' : 'Switch to ₹'}
              </button>
            </div>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">
              {formatSalary(career.salary_min, career.salary_max)}
            </p>
            {currency === 'INR' ? (
              <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
                {getSalaryBreakdown(career.salary_min, career.salary_max).inrFull}
              </p>
            ) : (
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                Annual US benchmark
              </p>
            )}
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Market Growth</p>
            <p className="text-lg font-bold text-emerald-600">{career.future_growth}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Entry Difficulty</p>
            <p className="text-lg font-bold text-slate-900">{career.difficulty}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Prerequisite Education</p>
            <p className="text-xs font-semibold text-slate-800 line-clamp-2 mt-0.5">{career.education}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 flex border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview & Daily Tasks' },
          { id: 'skills', label: 'Skills, Tools & Tradeoffs' },
          { id: 'projects', label: 'Recommended Projects' },
          { id: 'resources', label: 'Curated Learning Resources' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as any)}
            className={`border-b-2 py-3 px-4 text-xs font-bold transition whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {/* TAB 1: OVERVIEW & RESPONSIBILITIES */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Role In-Depth Summary</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{career.overview}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Day-to-Day Responsibilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {career.responsibilities.map((resp, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Key Employing Industries</h3>
              <div className="flex flex-wrap gap-2">
                {career.industries.map((ind, i) => (
                  <span key={i} className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-800">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SKILLS, TOOLS & TRADEOFFS */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Core Technical Competencies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {career.skills.map((sk, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-800 flex items-center justify-between">
                    <span>{sk}</span>
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700 font-bold">Required</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Industry Software & Toolsets</h3>
              <div className="flex flex-wrap gap-2">
                {career.tools.map((tool, i) => (
                  <span key={i} className="rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-slate-800">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros & Cons (Objective assessment) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6">
                <h3 className="text-base font-bold text-emerald-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>Key Advantages & Rewards</span>
                </h3>
                <ul className="space-y-2 text-xs text-emerald-950">
                  {career.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50/40 p-6">
                <h3 className="text-base font-bold text-red-900 mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span>Tradeoffs & Real-World Pressures</span>
                </h3>
                <ul className="space-y-2 text-xs text-red-950">
                  {career.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RECOMMENDED PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500">
              Hands-on capstones that provide verifiable proof of competency for hiring managers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(career.recommendedProjects && career.recommendedProjects.length > 0
                ? career.recommendedProjects
                : []
              ).map(proj => (
                <div key={proj.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                        {proj.difficulty}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        ⏱️ {proj.duration}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      ★ {proj.portfolio_value} Portfolio Impact
                    </span>
                    <Link
                      to="/projects"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View in Projects Catalog →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CURATED RESOURCES */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500">
              High-value learning pathways vetted for rigor, clarity, and industry relevance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(career.recommendedResources && career.recommendedResources.length > 0
                ? career.recommendedResources
                : []
              ).map(res => (
                <div key={res.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {res.provider}
                      </span>
                      <span className={`text-[10px] font-bold ${res.is_free ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {res.is_free ? '100% Free' : 'Verified Certification'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{res.title}</h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{res.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                    >
                      <span>Access Course Guide</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
