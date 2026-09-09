import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Award,
  TrendingUp,
  MapPin,
  Bookmark,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CareerRecommendation, QuizQuestion } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, savedCareerIds, toggleCareerBookmark } = useAuth();
  const { formatSalary } = useCurrency();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<{
    hasResults: boolean;
    recommendations: CareerRecommendation[];
    topCareer?: CareerRecommendation;
  } | null>(null);

  useEffect(() => {
    async function loadQuizData() {
      try {
        const [qRes, rRes] = await Promise.all([
          api.getQuizQuestions(),
          api.getQuizResults().catch(() => ({ hasCompletedQuiz: false, latestResult: null, recommendations: [] }))
        ]);
        setQuestions(qRes.questions);

        if (rRes.hasCompletedQuiz && rRes.recommendations.length > 0) {
          setResults({
            hasResults: true,
            recommendations: rRes.recommendations,
            topCareer: rRes.recommendations[0]
          });
        }
      } catch (err) {
        console.error('Failed to load quiz questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuizData();
  }, []);

  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;
  const isSelected = (optId: string) => answers[currentQuestion?.id] === optId;

  const handleSelectOption = (optId: string) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Format answers array
    const formattedAnswers: { questionId: string; answerId: string }[] = Object.entries(answers).map(([qId, ansId]) => ({
      questionId: qId,
      answerId: String(ansId)
    }));

    if (formattedAnswers.length < questions.length) {
      const confirmSubmit = window.confirm(
        `You answered ${formattedAnswers.length} of ${questions.length} questions. Do you want to submit and compute recommendations now?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitQuiz(formattedAnswers);
      setResults({
        hasResults: true,
        recommendations: res.recommendations,
        topCareer: res.topCareer
      });
    } catch (err: any) {
      alert(err.message || 'Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResults(null);
    setCurrentIndex(0);
    setAnswers({});
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">Loading career assessment questions...</p>
        </div>
      </div>
    );
  }

  // --- RESULTS VIEW ---
  if (results && results.hasResults) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-xs mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Assessment Completed & Analyzed</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your Personalized Career Matches
              </h1>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Based on your answers across problem-solving, work environment, and learning preferences, our algorithm mapped your profile against 50+ career models.
              </p>
            </div>
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>

        {/* Top Recommendation Highlight */}
        {results.topCareer && (
          <div className="mt-8 rounded-2xl border-2 border-blue-500 bg-white p-6 sm:p-8 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-extrabold text-white">
                    #1 Top Recommendation
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {results.topCareer.matchPercentage}% Compatibility Match
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {results.topCareer.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-slate-600 font-medium">
                  <span>Category: <strong>{results.topCareer.category}</strong></span>
                  <span>Entry Difficulty: <strong>{results.topCareer.difficulty}</strong></span>
                  <span>Market Demand: <strong>{results.topCareer.demandLevel}</strong></span>
                  <span>Salary Range: <strong className="text-slate-900">{formatSalary(results.topCareer.salaryMin, results.topCareer.salaryMax)}</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={async () => {
                    try {
                      const res = await api.generateRoadmap(results.topCareer!.careerId);
                      navigate(`/roadmaps/${res.roadmapId}`);
                    } catch (err: any) {
                      alert(err.message || 'Failed to generate roadmap.');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Generate Personalized Roadmap</span>
                </button>
                <Link
                  to={`/careers/${results.topCareer.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span>Explore Full Career Specs</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Why Recommended & Skill Gaps */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
              <div className="rounded-xl bg-blue-50/60 p-4 border border-blue-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>Why This Matches You</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-blue-950">
                  {results.topCareer.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-amber-50/60 p-4 border border-amber-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Identified Skill Gaps to Bridge</span>
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {results.topCareer.skillGaps.map((sk, i) => (
                    <span key={i} className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-amber-900 border border-amber-200">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Matched Careers */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Other High-Compatibility Matches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.recommendations.slice(1, 7).map((career, idx) => {
              const isSaved = savedCareerIds.has(career.careerId);
              return (
                <div
                  key={career.careerId}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                        #{idx + 2} Match
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                          {career.matchPercentage}%
                        </span>
                        <button
                          onClick={() => toggleCareerBookmark(career.careerId)}
                          className="rounded-lg p-1 text-slate-400 hover:text-amber-600"
                        >
                          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-amber-600' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <Link to={`/careers/${career.slug}`}>
                      <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition">
                        {career.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-xs font-semibold text-blue-600">{career.category}</p>

                    <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
                      <p className="font-semibold text-slate-800 mb-1">Match Factor:</p>
                      <p className="text-[11px]">{career.reasons[0] || 'Strong alignment with your problem-solving style'}</p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-700 font-bold">
                      {formatSalary(career.salaryMin, career.salaryMax)}
                    </span>
                    <Link
                      to={`/careers/${career.slug}`}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTIONS STEPPER VIEW ---
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Header bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progressPercent}% completed</span>
        </div>
        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {currentQuestion && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-md">
          <div className="mb-6 flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {currentQuestion.category}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
            {currentQuestion.question}
          </h2>

          <div className="mt-8 space-y-3">
            {currentQuestion.options.map(option => {
              const selected = isSelected(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                    selected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <span className={`text-sm font-medium ${selected ? 'text-blue-900 font-semibold' : 'text-slate-700'}`}>
                    {option.text}
                  </span>
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      selected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{submitting ? 'Calculating Matches...' : 'Submit Assessment'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
