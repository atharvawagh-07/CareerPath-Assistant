import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Bookmark,
  GitCompare,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { Career } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useCurrency } from '../context/CurrencyContext';

export const CareersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { savedCareerIds, toggleCareerBookmark } = useAuth();
  const { isCareerComparing, addCareerToCompare, removeCareerFromCompare } = useCompare();
  const { currency, setCurrency, formatSalary } = useCurrency();

  const [careers, setCareers] = useState<Career[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [demandLevel, setDemandLevel] = useState(searchParams.get('demandLevel') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'demand_desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Sync state with URL search parameters on browser navigation
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || 'All';
    const urlDifficulty = searchParams.get('difficulty') || 'All';
    const urlDemandLevel = searchParams.get('demandLevel') || 'All';
    const urlSort = searchParams.get('sort') || 'demand_desc';
    const urlPage = parseInt(searchParams.get('page') || '1', 10);

    if (urlSearch !== search) setSearch(urlSearch);
    if (urlCategory !== category) setCategory(urlCategory);
    if (urlDifficulty !== difficulty) setDifficulty(urlDifficulty);
    if (urlDemandLevel !== demandLevel) setDemandLevel(urlDemandLevel);
    if (urlSort !== sort) setSort(urlSort);
    if (urlPage !== page) setPage(urlPage);
  }, [searchParams]);

  // Push active filter parameters to URL searchParams
  useEffect(() => {
    const nextParams: Record<string, string> = {};
    if (search.trim()) nextParams.search = search.trim();
    if (category !== 'All') nextParams.category = category;
    if (difficulty !== 'All') nextParams.difficulty = difficulty;
    if (demandLevel !== 'All') nextParams.demandLevel = demandLevel;
    if (sort !== 'demand_desc') nextParams.sort = sort;
    if (page > 1) nextParams.page = page.toString();

    setSearchParams(nextParams, { replace: true });
  }, [search, category, difficulty, demandLevel, sort, page, setSearchParams]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.getCareerCategories();
        setCategories(['All', ...res.categories.map(c => c.category)]);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch careers based on filters
  useEffect(() => {
    async function fetchCareers() {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          limit: '12',
          sort
        };
        if (search.trim()) params.search = search.trim();
        if (category !== 'All') params.category = category;
        if (difficulty !== 'All') params.difficulty = difficulty;
        if (demandLevel !== 'All') params.demandLevel = demandLevel;

        const res = await api.getCareers(params);
        setCareers(res.careers);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.total);
      } catch (err) {
        console.error('Failed to load careers:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCareers();
  }, [search, category, difficulty, demandLevel, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setDifficulty('All');
    setDemandLevel('All');
    setSort('demand_desc');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Career Directory</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Explore 50+ In-Demand Technical Careers
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl">
          Browse comprehensive profiles covering salary ranges, market demand, foundational education, core competencies, and day-to-day responsibilities.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search careers, skills, or industries..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={category}
              onChange={e => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs sm:text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <select
              value={difficulty}
              onChange={e => {
                setDifficulty(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs sm:text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Entry Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sort}
              onChange={e => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs sm:text-sm text-slate-900 outline-hidden transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="demand_desc">Highest Market Demand</option>
              <option value="salary_desc">Highest Compensation</option>
              <option value="salary_asc">Lowest Starting Salary</option>
              <option value="title_asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Reset */}
        <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-3">
            <span>Showing <strong>{careers.length}</strong> of <strong>{totalCount}</strong> matching careers</span>
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
              <span className="text-[11px] font-medium text-slate-500">Currency:</span>
              <button
                type="button"
                onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                className="flex items-center gap-1 font-bold text-xs hover:text-slate-900 transition"
              >
                <span className={currency === 'INR' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'}>₹ INR (LPA)</span>
                <span className="text-slate-300">/</span>
                <span className={currency === 'USD' ? 'text-blue-700 font-extrabold' : 'text-slate-400'}>$ USD</span>
              </button>
            </div>
          </div>
          <button
            onClick={handleResetFilters}
            className="text-blue-600 hover:underline font-semibold"
          >
            Reset all filters
          </button>
        </div>
      </div>

      {/* Career Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : careers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <SlidersHorizontal className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-3 text-lg font-bold text-slate-800">No careers match your criteria</h3>
          <p className="mt-1 text-xs text-slate-500">Try adjusting your search terms or clearing specific category filters.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {careers.map(career => {
            const isSaved = savedCareerIds.has(career.id);
            const isComparing = isCareerComparing(career.id);

            return (
              <div
                key={career.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
                      {career.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleCareerBookmark(career.id)}
                        title={isSaved ? 'Remove bookmark' : 'Save career bookmark'}
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
                    <h2 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition">
                      {career.title}
                    </h2>
                  </Link>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {career.description}
                  </p>

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

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {career.skills.slice(0, 3).map((sk, i) => (
                      <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                        {sk}
                      </span>
                    ))}
                    {career.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{career.skills.length - 3} more
                      </span>
                    )}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="px-3 text-xs font-semibold text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
