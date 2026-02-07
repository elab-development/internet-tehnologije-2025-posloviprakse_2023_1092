import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, DollarSign, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../services/api';

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applyStatus, setApplyStatus] = useState({ type: '', message: '' });
  const { user, isAuthenticated, isStudent } = useAuth();

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await jobsAPI.getById(id);
      setJob(data.data || data);
    } catch (err) {
      setError('Nije moguće učitati oglas.');
    } finally {
      setLoading(false);
    }
  };

  const canApply = isAuthenticated() && (isStudent() || user?.role === 'alumni');

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyStatus({ type: '', message: '' });

    if (!isAuthenticated()) {
      setApplyStatus({ type: 'error', message: 'Morate biti prijavljeni da biste aplicirali.' });
      return;
    }

    try {
      await applicationsAPI.apply(id, { coverLetter });
      setApplyStatus({ type: 'success', message: 'Prijava je poslata! Prati status u profilu.' });
      setCoverLetter('');
    } catch (err) {
      setApplyStatus({ type: 'error', message: err.message || 'Greška pri slanju prijave.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4" />
          <p className="text-slate-600">Učitavanje oglasa...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-700">
          <p className="text-lg font-semibold">{error}</p>
          <Link to="/jobs" className="text-emerald-600 hover:underline mt-4 inline-block">
            Nazad na oglase
          </Link>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/jobs" className="text-slate-600 hover:text-slate-900 font-semibold">
          ← Nazad na oglase
        </Link>

        <div className="bg-white rounded-3xl shadow border border-slate-100 p-8 mt-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-950">{job.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-slate-600">
                <Building2 size={18} className="text-emerald-500" />
                <span>{job.company?.companyName || 'Kompanija'}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-500" />
                {job.location}
              </div>
            )}
            {job.jobType && (
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-500" />
                {job.jobType}
              </div>
            )}
            {job.experienceLevel && (
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-emerald-500" />
                {job.experienceLevel}
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-500" />
                €{job.salary}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Opis</h2>
            <p className="text-slate-700 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Potrebne veštine</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow border border-slate-100 p-8 mt-8">
          <h2 className="text-2xl font-display font-semibold text-slate-950 mb-4">Apliciraj</h2>

          {!user && (
            <p className="text-slate-600">
              Prijavi se ili registruj da bi aplicirao.
            </p>
          )}

          {user && !canApply && (
            <p className="text-slate-600">
              Samo student ili alumni mogu aplicirati na oglase.
            </p>
          )}

          {canApply && (
            <form onSubmit={handleApply} className="space-y-4">
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Kratko pismo motivacije (opciono)"
                rows="5"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-400"
              />

              {applyStatus.message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    applyStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {applyStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-500 transition"
              >
                Pošalji prijavu
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
