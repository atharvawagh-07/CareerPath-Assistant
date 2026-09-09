import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Target,
  BookOpen,
  GitCompare,
  MapPin,
  FolderGit2,
  Bookmark,
  Award,
  TrendingUp,
  DollarSign,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { Career } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useCurrency } from '../context/CurrencyContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { savedCareerIds, toggleCareerBookmark } = useAuth();
  const { isCareerComparing, addCareerToCompare, removeCareerFromCompare } = useCompare();
  const { formatSalary } = useCurrency();

  const [featuredCareers, setFeaturedCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AI & Data', 'Software', 'Cybersecurity', 'Cloud', 'Design & Product'];

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getCareers({ limit: '6' });
        setFeaturedCareers(res.careers);
      } catch (err) {
        console.error('Failed to load featured careers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stages = [
    { num: '01', title: 'Discover', desc: 'Identify your true underlying interests and strengths through interactive prompts.', icon: Compass, link: '/assessment' },
    { num: '02', title: 'Assess', desc: 'Complete our 30-question diagnostic evaluating 8 core psychometric domains.', icon: Sparkles, link: '/assessment' },
    { num: '03', title: 'Explore', desc: 'Review 50+ detailed career breakdowns with salaries, demand, and work styles.', icon: BookOpen, link: '/careers' },
    { num: '04', title: 'Compare', desc: 'Place up to 3 paths side-by-side to evaluate tradeoffs, salaries, and trajectories.', icon: GitCompare, link: '/compare' },
    { num: '05', title: 'Plan', desc: 'Generate customized phase-by-phase learning roadmaps tailored to your baseline.', icon: MapPin, link: '/roadmaps' },
    { num: '06', title: 'Learn', desc: 'Access 50+ curated courses, books, and university-grade verified resources.', icon: Bookmark, link: '/resources' },
    { num: '07', title: 'Build', desc: 'Execute real-world portfolio capstones that prove your practical craftsmanship.', icon: FolderGit2, link: '/projects' },
    { num: '08', title: 'Prepare', desc: 'Measure your Career Readiness Score (CRI) and master technical interviews.', icon: Award, link: '/readiness' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.25),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>Intelligent Career Guidance Built Specifically for Students</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Discover, Plan, and Build Your <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">Meaningful Career</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Replace anxiety and ambiguous advice with structured, data-driven orientation.
              Take our comprehensive 30-question assessment, explore 50+ technical careers, build actionable milestones, and track your Career Readiness Score.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/assessment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Take 30-Question Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/careers"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
              >
                <BookOpen className="h-4 w-4 text-blue-400" />
                <span>Explore 50+ Careers</span>
              </Link>
            </div>

            {/* Micro Stats Bar */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-8 sm:grid-cols-4 max-w-3xl mx-auto text-left">
              <div>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-slate-400">Detailed Careers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100+</p>
                <p className="text-xs text-slate-400">Verified Skills</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">30 Qs</p>
                <p className="text-xs text-slate-400">Holistic Assessment</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-slate-400">Data-Driven & Transparent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Methodology Philosophy */}
      <section className="border-y border-blue-100 bg-blue-50/50 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-xs font-medium text-blue-900">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
          <span>
            <strong>Our Commitment:</strong> CareerPath provides transparent data-driven guidance and structured skill gap roadmaps. We empower your judgment without claiming to scientifically predict your future.
          </span>
        </div>
      </section>

      {/* The 8-Stage Progression Model */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The Student Journey</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            From Curiosity to Career Readiness in 8 Steps
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Every step is designed to convert abstract career ideas into tangible milestones and demonstrable portfolio achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map(st => {
            const Icon = st.icon;
            return (
              <Link
                key={st.num}
                to={st.link}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                    {st.num}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {st.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
                  <span>Explore step</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured In-Demand Careers */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Market Opportunities</span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              High-Growth Technical Career Paths
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Curated by market demand, salary benchmarks, and long-term relevance.
            </p>
          </div>
          <Link
            to="/careers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>View all 50+ careers</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCareers
              .filter(c => selectedCategory === 'All' || c.category === selectedCategory)
              .map(career => {
                const isSaved = savedCareerIds.has(career.id);
                const isComparing = isCareerComparing(career.id);

                return (
                  <div
                    key={career.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                          {career.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleCareerBookmark(career.id)}
                            title={isSaved ? 'Remove bookmark' : 'Bookmark career'}
                            className={`rounded-lg p-1.5 transition ${
                              isSaved ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                          >
                            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
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
                            title="Compare career"
                            className={`rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                              isComparing
                                ? 'bg-indigo-600 text-white'
                                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {isComparing ? 'Comparing' : '+ Compare'}
                          </button>
                        </div>
                      </div>

                      <Link to={`/careers/${career.slug}`}>
                        <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition">
                          {career.title}
                        </h3>
                      </Link>

                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {career.description}
                      </p>

                      {/* Salary & Demand Metrics */}
                      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
                        <div>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Salary Range</p>
                          <p className="font-bold text-slate-900">
                            {formatSalary(career.salary_min, career.salary_max)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Demand</p>
                          <p className="font-bold text-emerald-600 flex items-center gap-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            {career.demand_level}
                          </p>
                        </div>
                      </div>

                      {/* Top Skills Tags */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {career.skills.slice(0, 3).map((sk, i) => (
                          <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500">
                        {career.difficulty} Entry
                      </span>
                      <Link
                        to={`/careers/${career.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>

      {/* Assessment Callout Banner */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-xs">
              Personalized Orientation
            </span>
            <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight">
              Unsure which path matches your strengths?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              Our 30-question diagnostic scores your affinities across 8 dimensions including problem-solving patterns, work-style preferences, and technical inclinations.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/assessment"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-800 shadow-md hover:bg-blue-50 transition"
              >
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Start Free Assessment (10 mins)</span>
              </Link>
              <span className="text-xs text-blue-200">
                ⚡ Instant analysis & skill gap report
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
