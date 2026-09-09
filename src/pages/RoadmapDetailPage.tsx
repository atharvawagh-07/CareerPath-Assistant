import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  FolderGit2,
  Award,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Roadmap, RoadmapStep } from '../types';
import { api } from '../services/api';

export const RoadmapDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingStepId, setTogglingStepId] = useState<string | null>(null);

  useEffect(() => {
    async function loadRoadmap() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.getRoadmap(id);
        setRoadmap(res.roadmap);
      } catch (err) {
        console.error('Failed to load roadmap details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, [id]);

  const handleToggleStep = async (stepId: string) => {
    setTogglingStepId(stepId);
    try {
      const res = await api.toggleRoadmapStep(stepId);
      setRoadmap(prev => {
        if (!prev || !prev.steps) return prev;
        const updatedSteps = prev.steps.map(s =>
          s.id === stepId ? { ...s, completed: res.completed } : s
        );
        return {
          ...prev,
          progress: res.roadmapProgress,
          steps: updatedSteps
        };
      });
    } catch (err: any) {
      alert('Failed to update step status.');
    } finally {
      setTogglingStepId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">Loading career roadmap curriculum...</p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Roadmap not found</h2>
        <Link
          to="/roadmaps"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Roadmaps</span>
        </Link>
      </div>
    );
  }

  const steps = roadmap.steps || [];
  const completedCount = steps.filter(s => s.completed).length;
  const totalHours = steps.reduce((sum, s) => sum + (s.estimated_hours || 0), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        to="/roadmaps"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to all roadmaps</span>
      </Link>

      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-bold text-blue-700">
                {roadmap.career_category || 'Technology'}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Target: <strong>{roadmap.career_title}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {roadmap.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                ~{totalHours} Estimated Study Hours
              </span>
              <span>•</span>
              <span>{steps.length} Milestone Phases</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 shrink-0 w-full sm:w-64">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-700">Roadmap Progress</span>
              <span className="text-blue-600">{roadmap.progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${roadmap.progress}%` }}
              />
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-500 font-medium">
              {completedCount} of {steps.length} milestones checked
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative space-y-6 before:absolute before:inset-0 before:left-5 sm:before:left-6 before:h-full before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isToggling = togglingStepId === step.id;

          return (
            <div key={step.id} className="relative flex items-start gap-4 sm:gap-6 group">
              {/* Step indicator circle / checkbox */}
              <button
                onClick={() => handleToggleStep(step.id)}
                disabled={isToggling}
                className={`relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border-2 transition-all ${
                  step.completed
                    ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                    : 'border-slate-300 bg-white text-slate-400 hover:border-blue-500 hover:text-blue-600 shadow-xs'
                }`}
                title={step.completed ? 'Mark milestone incomplete' : 'Mark milestone complete'}
              >
                {step.completed ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <span className="text-xs font-bold text-slate-600">{idx + 1}</span>
                )}
              </button>

              {/* Step content card */}
              <div
                className={`flex-1 rounded-2xl border p-6 transition-all ${
                  step.completed
                    ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                    : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                      {step.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {step.estimated_hours} hrs
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleStep(step.id)}
                    className={`text-xs font-bold transition ${
                      step.completed ? 'text-emerald-700 hover:underline' : 'text-blue-600 hover:underline'
                    }`}
                  >
                    {step.completed ? '✓ Completed' : '○ Mark as Completed'}
                  </button>
                </div>

                <h3 className={`text-base sm:text-lg font-bold ${step.completed ? 'text-slate-900 line-through text-slate-500' : 'text-slate-900'}`}>
                  {step.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Sub-elements: Skills, Resources, Projects */}
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-xs">
                  {/* Skills */}
                  <div>
                    <span className="font-bold text-slate-700 block mb-1.5">Acquired Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {step.skills.map((sk, i) => (
                        <span key={i} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Resources */}
                  <div>
                    <span className="font-bold text-slate-700 block mb-1.5">Study Resources:</span>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      {step.resources.map((res, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-slate-400 shrink-0" />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Projects */}
                  <div>
                    <span className="font-bold text-slate-700 block mb-1.5">Capstone Deliverable:</span>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      {step.projects.map((proj, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <FolderGit2 className="h-3 w-3 text-blue-500 shrink-0" />
                          <span>{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
