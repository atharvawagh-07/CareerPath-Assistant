import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  FolderGit2,
  MapPin,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { ReadinessScore } from '../types';
import { api } from '../services/api';

export const ReadinessPage: React.FC = () => {
  const [readiness, setReadiness] = useState<ReadinessScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReadiness() {
      try {
        const res = await api.getReadiness();
        setReadiness(res.readiness);
      } catch (err) {
        console.error('Failed to load readiness score:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReadiness();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">Computing your Career Readiness Index...</p>
        </div>
      </div>
    );
  }

  const score = readiness?.totalScore || 0;
  const level = readiness?.level || 'Beginner';
  const breakdown = readiness?.breakdown || {
    skillsScore: 0,
    projectsScore: 0,
    roadmapScore: 0,
    portfolioScore: 0
  };

  const chartData = [
    { subject: 'Skills (25%)', score: breakdown.skillsScore, max: 25, fullMark: 25 },
    { subject: 'Projects (25%)', score: breakdown.projectsScore, max: 25, fullMark: 25 },
    { subject: 'Roadmap (30%)', score: breakdown.roadmapScore, max: 30, fullMark: 30 },
    { subject: 'Portfolio (20%)', score: breakdown.portfolioScore, max: 20, fullMark: 20 }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Objective Diagnostics</span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Career Readiness Index (CRI)
        </h1>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          A weighted 4-pillar index measuring your verified technical competencies, capstone project completion, curriculum milestones, and portfolio assets.
        </p>
      </div>

      {/* Main Score & Level Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-blue-50 bg-slate-50 shadow-inner">
            <div className="text-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900">{score}</span>
              <span className="text-xs font-bold text-slate-400 block">/ 100 PTS</span>
            </div>
          </div>

          <div className="mt-6">
            <span className={`inline-block rounded-full px-4 py-1 text-xs font-bold ${
              level === 'Job Ready'
                ? 'bg-emerald-100 text-emerald-800'
                : level === 'Developing'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              Status: {level}
            </span>
            <p className="mt-2 text-xs text-slate-500">
              {level === 'Job Ready'
                ? 'Excellent! You meet core market requirements and have proven capstone deliverables.'
                : level === 'Developing'
                ? 'Good momentum! Complete 2 more project milestones to enter interview-ready tier.'
                : 'You are establishing fundamentals. Follow your active roadmap milestones.'}
            </p>
          </div>
        </div>

        {/* 4 Pillars Breakdown Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Readiness Pillars Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" domain={[0, 30]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="subject" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} / ${item.payload.max} pts`,
                    'Earned Score'
                  ]}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#3b82f6' : index === 1 ? '#6366f1' : index === 2 ? '#8b5cf6' : '#10b981'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-4 text-center">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Verified Skills</p>
              <p className="text-base font-bold text-slate-900">{readiness?.stats.skillsCount || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Projects Completed</p>
              <p className="text-base font-bold text-slate-900">{readiness?.stats.projectsCompleted || 0}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Roadmap Progress</p>
              <p className="text-base font-bold text-slate-900">{readiness?.stats.roadmapProgress || 0}%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Saved Targets</p>
              <p className="text-base font-bold text-slate-900">{readiness?.stats.savedCareersCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Next Actions */}
      <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">Personalized Next Actions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {readiness?.recommendedActions.map((action, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs border border-blue-100">
              <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                  {action}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-blue-200/60">
          <span className="text-xs text-blue-900 font-medium">
            Completing these items will directly increase your readiness percentage.
          </span>
          <div className="flex gap-2">
            <Link
              to="/profile"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
            >
              Update Skills on Profile →
            </Link>
            <Link
              to="/projects"
              className="rounded-xl border border-blue-300 bg-white px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 transition"
            >
              Start a Project →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
