import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, Briefcase, MapPin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    jobType: 'Full-time',
    experienceLevel: 'Entry',
    salary: '',
    requiredSkills: '',
    deadline: ''
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
  const experienceLevels = ['Entry', 'Mid', 'Senior'];
  const categories = ['IT', 'Marketing', 'Sales', 'Design', 'HR', 'Finance', 'Engineering', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Naslov oglasa je obavezan';
    if (formData.title.trim().length < 5) return 'Naslov mora imati najmanje 5 karaktera';
    if (!formData.description.trim()) return 'Opis oglasa je obavezan';
    if (formData.description.trim().length < 20) return 'Opis mora imati najmanje 20 karaktera';
    if (!formData.category) return 'Kategorija je obavezna';
    if (!formData.location.trim()) return 'Lokacija je obavezna';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validacija
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        requiredSkills: formData.requiredSkills
          ? formData.requiredSkills.split(',').map((item) => item.trim()).filter(Boolean)
          : [],
        deadline: formData.deadline || null
      };

      await jobsAPI.create(payload);

      setSuccess('✅ Oglas je uspešno kreiran! Preusmeravamo...');
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Greška pri kreiranju oglasa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0f766e_0%,transparent_50%)] opacity-40 pointer-events-none" />
      <div className="absolute top-20 right-10 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 font-semibold transition"
        >
          <ArrowLeft size={20} />
          Nazad
        </button>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <Briefcase className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-amber-300 font-semibold tracking-widest uppercase text-xs">Novi Oglas</p>
              <h1 className="text-4xl font-display font-bold text-white mt-1">Postavi Novi Oglas</h1>
              <p className="text-slate-300 mt-1">
                Kreiraj oglas za posao i pronađi idealne kandidate
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/60 rounded-3xl border border-white/10 p-8 backdrop-blur-sm">
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 rounded-lg flex gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                  <p className="text-red-300 font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-lg flex gap-3">
                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                  <p className="text-emerald-300 font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Naslov Oglasa * <span className="text-xs text-slate-400">{formData.title.length}/100</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="npr. Senior React Developer, Frontend Engineer, UI/UX Designer"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength="100"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                  <p className="text-xs text-slate-400 mt-1">Budi jasan i upečatljiv</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Opis Oglasa * <span className="text-xs text-slate-400">{formData.description.length}/5000</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Detaljno objasni:
- Za koji posao se radi
- Obaveze i odgovornosti
- Očekivanja i zahtjevi
- Gdje će kandidat raditi
- Što će raditi u timu"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="6"
                    maxLength="5000"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* Category & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Kategorija *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                    >
                      <option value="" className="bg-slate-900">Izaberi kategoriju...</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Lokacija *
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="npr. Beograd, Remote, Novi Sad"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                    />
                  </div>
                </div>

                {/* Job Type & Experience Level */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Tip Angažmana
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                    >
                      {jobTypes.map(type => (
                        <option key={type} value={type} className="bg-slate-900">{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Nivo Iskustva
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                    >
                      {experienceLevels.map(level => (
                        <option key={level} value={level} className="bg-slate-900">{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Salary & Deadline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Plata (EUR, opciono)
                    </label>
                    <input
                      type="number"
                      name="salary"
                      placeholder="npr. 1500"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-2">
                      Rok za Prijavu (opciono)
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                    />
                  </div>
                </div>

                {/* Required Skills */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Potrebne Veštine (opciono)
                  </label>
                  <textarea
                    name="requiredSkills"
                    placeholder="Nabroji veštine odvojene zarezom
npr. React, Node.js, PostgreSQL, Git, Docker, AWS"
                    value={formData.requiredSkills}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-white/10 flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-full bg-emerald-400 text-slate-900 font-bold hover:bg-emerald-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Učitavanje...' : '✅ Postavi Oglas'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold hover:border-white/60 hover:bg-white/5 transition"
                  >
                    👁️ Pregled
                  </button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-emerald-500/10 border-l-4 border-emerald-400 rounded-lg">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-emerald-300">💡 Savjet:</span> Napiši detaljno i jasno kako biste privukli prave kandidate. Oglas će biti moderiran prije nego što bude javno vidljiv.
                </p>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-slate-900/60 rounded-3xl border border-white/10 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4">📋 Pregled</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs mb-1">NASLOV</p>
                  <p className="font-bold text-white">{formData.title || '(Nije uneseno)'}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs mb-2">OSNOVNO</p>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-slate-300">
                      <MapPin size={16} className="text-emerald-400" />
                      {formData.location || '(Nije uneseno)'}
                    </p>
                    <p className="flex items-center gap-2 text-slate-300">
                      <Briefcase size={16} className="text-emerald-400" />
                      {formData.jobType}
                    </p>
                    {formData.salary && (
                      <p className="flex items-center gap-2 text-slate-300">
                        <DollarSign size={16} className="text-emerald-400" />
                        €{formData.salary}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs mb-1">OPIS</p>
                  <p className="text-slate-300 line-clamp-3">
                    {formData.description || '(Nije uneseno)'}
                  </p>
                </div>

                {formData.requiredSkills && (
                  <div>
                    <p className="text-slate-400 text-xs mb-2">VEŠTINE</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.requiredSkills.split(',').filter(s => s.trim()).slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="bg-emerald-400/20 text-emerald-300 text-xs rounded-full px-2 py-1 border border-emerald-400/30">
                          {skill.trim()}
                        </span>
                      ))}
                      {formData.requiredSkills.split(',').filter(s => s.trim()).length > 3 && (
                        <span className="text-slate-400 text-xs">+{formData.requiredSkills.split(',').filter(s => s.trim()).length - 3} više</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
