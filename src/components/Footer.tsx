import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, ShieldCheck, Heart, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const Footer: React.FC = () => {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackEmail || !feedbackMsg) return;
    setSubmitting(true);
    try {
      await api.submitFeedback({
        name: feedbackName,
        email: feedbackEmail,
        message: feedbackMsg,
        type: 'PLATFORM_IMPROVEMENT'
      });
      setFeedbackSent(true);
      setFeedbackMsg('');
    } catch {
      // Ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Philosophy */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <Compass className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Career<span className="text-blue-400">Path</span>
              </span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-400">
              An intelligent career-orientation platform designed for youth and college students.
              Translating curiosity into structured, real-world execution.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Transparent algorithmic orientation — no deterministic claims.</span>
            </div>
          </div>

          {/* Column 2: Navigation Pathways */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Orientation Journey
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link to="/assessment" className="hover:text-white transition">
                  Take 30-Question Assessment
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition">
                  Explore 50+ In-Demand Careers
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition">
                  Side-by-Side Career Comparison
                </Link>
              </li>
              <li>
                <Link to="/roadmaps" className="hover:text-white transition">
                  Personalized Learning Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition">
                  Portfolio Capstone Projects
                </Link>
              </li>
              <li>
                <Link to="/readiness" className="hover:text-white transition">
                  Career Readiness Index (CRI)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The 8-Stage Methodology */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              8-Stage Methodology
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400">
              <span className="rounded bg-slate-800 px-2 py-1">1. Discover</span>
              <span className="rounded bg-slate-800 px-2 py-1">2. Assess</span>
              <span className="rounded bg-slate-800 px-2 py-1">3. Explore</span>
              <span className="rounded bg-slate-800 px-2 py-1">4. Compare</span>
              <span className="rounded bg-slate-800 px-2 py-1">5. Plan</span>
              <span className="rounded bg-slate-800 px-2 py-1">6. Learn</span>
              <span className="rounded bg-slate-800 px-2 py-1">7. Build</span>
              <span className="rounded bg-slate-800 px-2 py-1">8. Prepare</span>
            </div>
            <p className="mt-3 text-[11px] text-slate-400 leading-normal">
              Structured to replace vague advice with verifiable skill building.
            </p>
          </div>

          {/* Column 4: Student Feedback & Suggestion Box */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Student Feedback Box
            </h4>
            <p className="mt-2 text-xs text-slate-400">
              Have suggestions or career pathways you would like added?
            </p>
            {feedbackSent ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-950/80 border border-emerald-800 p-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Thank you! Your feedback has been submitted to platform administrators.</span>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={feedbackName}
                  onChange={e => setFeedbackName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={feedbackEmail}
                  onChange={e => setFeedbackEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                />
                <textarea
                  rows={2}
                  placeholder="Share ideas, bugs, or career requests..."
                  value={feedbackMsg}
                  onChange={e => setFeedbackMsg(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Send Feedback'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} CareerPath. Built for youth and college student empowerment.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Data-Driven Orientation</span>
            <span>•</span>
            <span>Skill Gap Analysis</span>
            <span>•</span>
            <span>Verified Curricula</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
