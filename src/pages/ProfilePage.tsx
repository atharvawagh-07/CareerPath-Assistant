import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  GraduationCap,
  Building2,
  Bookmark,
  Award,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Sparkles
} from 'lucide-react';
import { Career, Resource, Skill, User as UserType } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser, savedCareerIds, toggleCareerBookmark, savedResourceIds, toggleResourceBookmark } = useAuth();
  const { formatSalary } = useCurrency();

  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [savedCareers, setSavedCareers] = useState<Career[]>([]);
  const [savedResources, setSavedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile form state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [educationLevel, setEducationLevel] = useState(user?.educationLevel || 'Undergraduate Junior (Year 3)');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [careerGoals, setCareerGoals] = useState(user?.careerGoals || '');
  const [workEnvironment, setWorkEnvironment] = useState(user?.workEnvironment || 'Remote / Hybrid Tech');

  // Add Skill state
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [proficiency, setProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [skillProgress, setSkillProgress] = useState<number>(60);

  const [activeTab, setActiveTab] = useState<'skills' | 'careers' | 'resources'>('skills');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [skillsRes, allSkRes, scRes, srRes] = await Promise.all([
          api.getUserSkills(),
          api.getSkills(),
          api.getSavedCareers(),
          api.getSavedResources()
        ]);
        setUserSkills(skillsRes.userSkills);
        setAllSkills(allSkRes.skills);
        setSavedCareers(scRes.savedCareers);
        setSavedResources(srRes.savedResources);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEducationLevel(user.educationLevel || 'Undergraduate Junior (Year 3)');
      setInstitution(user.institution || '');
      setCareerGoals(user.careerGoals || '');
      setWorkEnvironment(user.workEnvironment || 'Remote / Hybrid Tech');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile({
        name,
        educationLevel,
        institution,
        careerGoals,
        workEnvironment
      });
      await refreshUser();
      setIsEditingProfile(false);
      alert('Profile updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    try {
      await api.saveUserSkill({
        skillId: selectedSkillId,
        proficiency,
        progress: skillProgress
      });
      const res = await api.getUserSkills();
      setUserSkills(res.userSkills);
      setIsAddingSkill(false);
      setSelectedSkillId('');
    } catch (err: any) {
      alert(err.message || 'Failed to add skill.');
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await api.deleteUserSkill(skillId);
      setUserSkills(prev => prev.filter(s => s.id !== skillId));
    } catch (err) {
      alert('Failed to delete skill.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-md">
              {(user?.name || 'Student').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                  {user?.educationLevel || 'Undergraduate'}
                </span>
                {user?.institution && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-slate-400" />
                      {user.institution}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Edit2 className="h-4 w-4" />
            <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {/* Career Goals & Work Environment */}
        {(user?.careerGoals || user?.workEnvironment) && !isEditingProfile && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-xs">
            {user.careerGoals && (
              <div className="rounded-xl bg-slate-50 p-3.5">
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Career Ambition</span>
                <p className="text-slate-800 leading-relaxed">{user.careerGoals}</p>
              </div>
            )}
            {user.workEnvironment && (
              <div className="rounded-xl bg-slate-50 p-3.5">
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">Preferred Environment</span>
                <p className="text-slate-800 leading-relaxed">{user.workEnvironment}</p>
              </div>
            )}
          </div>
        )}

        {/* Inline Edit Profile Form */}
        {isEditingProfile && (
          <form onSubmit={handleUpdateProfile} className="mt-6 border-t border-slate-100 pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Education Level</label>
                <select
                  value={educationLevel}
                  onChange={e => setEducationLevel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800"
                >
                  <option value="High School Senior">High School Senior</option>
                  <option value="Undergraduate Freshman (Year 1)">Undergraduate Freshman (Year 1)</option>
                  <option value="Undergraduate Sophomore (Year 2)">Undergraduate Sophomore (Year 2)</option>
                  <option value="Undergraduate Junior (Year 3)">Undergraduate Junior (Year 3)</option>
                  <option value="Undergraduate Senior (Year 4)">Undergraduate Senior (Year 4)</option>
                  <option value="Master's / Graduate Student">Master's / Graduate Student</option>
                  <option value="Recent Graduate / Career Changer">Recent Graduate / Career Changer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Institution</label>
                <input
                  type="text"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="University Name"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Work Environment Preference</label>
                <input
                  type="text"
                  value={workEnvironment}
                  onChange={e => setWorkEnvironment(e.target.value)}
                  placeholder="e.g. Remote / Collaborative Office"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Career Ambition Statement</label>
                <textarea
                  rows={2}
                  value={careerGoals}
                  onChange={e => setCareerGoals(e.target.value)}
                  placeholder="What roles or industries are you striving for?"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabs: Skills vs Saved Careers vs Saved Resources */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('skills')}
          className={`py-3 px-5 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'skills'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Verified Skills ({userSkills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('careers')}
          className={`py-3 px-5 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'careers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Bookmarked Careers ({savedCareers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`py-3 px-5 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'resources'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Bookmarked Resources ({savedResources.length})</span>
        </button>
      </div>

      {/* TAB 1: SKILLS MANAGEMENT */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Verified skills directly boost your Career Readiness Index score and match accuracy.
            </p>
            <button
              onClick={() => setIsAddingSkill(!isAddingSkill)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add / Verify Skill</span>
            </button>
          </div>

          {/* Add Skill Drawer / Modal Form */}
          {isAddingSkill && (
            <form onSubmit={handleSaveSkill} className="rounded-2xl border border-blue-200 bg-blue-50/40 p-6 space-y-4">
              <h3 className="text-sm font-bold text-blue-950">Add a Technical or Professional Skill</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Skill</label>
                  <select
                    value={selectedSkillId}
                    onChange={e => setSelectedSkillId(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800"
                  >
                    <option value="">Choose from 100+ skills...</option>
                    {allSkills.map(sk => (
                      <option key={sk.id} value={sk.id}>
                        {sk.name} ({sk.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Proficiency Level</label>
                  <select
                    value={proficiency}
                    onChange={e => setProficiency(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-800"
                  >
                    <option value="Beginner">Beginner (Foundational)</option>
                    <option value="Intermediate">Intermediate (Practiced)</option>
                    <option value="Advanced">Advanced (Production-Grade)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Mastery Progress: {skillProgress}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={skillProgress}
                    onChange={e => setSkillProgress(parseInt(e.target.value, 10))}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Save Skill
                </button>
              </div>
            </form>
          )}

          {/* Skills List */}
          {userSkills.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Award className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-xs text-slate-500">No skills logged yet. Add skills to power your readiness index!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSkills.map(sk => (
                <div key={sk.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                        {sk.category}
                      </span>
                      <button
                        onClick={() => handleDeleteSkill(sk.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete skill"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{sk.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{sk.proficiency} Proficiency</p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>Proficiency</span>
                      <span>{sk.progress || 50}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-blue-600" style={{ width: `${sk.progress || 50}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED CAREERS */}
      {activeTab === 'careers' && (
        <div>
          {savedCareers.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <Bookmark className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-xs text-slate-500">No saved careers yet.</p>
              <Link
                to="/careers"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
              >
                <span>Browse Careers</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCareers.map(c => (
                <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                        {c.category}
                      </span>
                      <button
                        onClick={async () => {
                          await toggleCareerBookmark(c.id);
                          setSavedCareers(prev => prev.filter(item => item.id !== c.id));
                        }}
                        className="text-amber-500 hover:text-red-500 p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{c.description}</p>
                    <p className="mt-3 text-xs font-bold text-slate-800">
                      {formatSalary(c.salary_min, c.salary_max)}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">{c.difficulty}</span>
                    <Link
                      to={`/careers/${c.slug}`}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED RESOURCES */}
      {activeTab === 'resources' && (
        <div>
          {savedResources.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <GraduationCap className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-xs text-slate-500">No saved resources yet.</p>
              <Link
                to="/resources"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
              >
                <span>Browse Educational Resources</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResources.map(r => (
                <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {r.provider}
                      </span>
                      <button
                        onClick={async () => {
                          await toggleResourceBookmark(r.id);
                          setSavedResources(prev => prev.filter(item => item.id !== r.id));
                        }}
                        className="text-amber-500 hover:text-red-500 p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{r.title}</h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{r.description}</p>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600">
                      {r.is_free ? '100% Free' : 'Certification'}
                    </span>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Open Guide →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
