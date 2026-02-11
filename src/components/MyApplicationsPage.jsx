import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI } from '../services/api';
import { Clock, CheckCircle, XCircle, AlertCircle, Briefcase } from 'lucide-react';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    // Ako korisnik nije student ili alumni, preusmerite na početnu
    if (!token || !user || !['student', 'alumni'].includes(user.role)) {
      navigate('/');
      return;
    }

    fetchApplications();
  }, [authLoading, token, user, navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationsAPI.getMyApplications();
      setApplications(response.data || []);
    } catch (err) {
      console.error('Greška pri učitavanju apliciranja:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <Clock className="text-blue-500" size={20} />;
      case 'reviewing':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'interview':
        return <Briefcase className="text-purple-500" size={20} />;
      case 'accepted':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-slate-400" size={20} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      applied: 'Aplikacija primljena',
      reviewing: 'U pregledu',
      interview: 'Pozvan na intervju',
      accepted: 'Prihvaćen/a',
      rejected: 'Odbijena'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-50 border-blue-200';
      case 'reviewing':
        return 'bg-yellow-50 border-yellow-200';
      case 'interview':
        return 'bg-purple-50 border-purple-200';
      case 'accepted':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Učitavanje apliciranja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-slate-950 mb-2">
            Moje Aplikacije
          </h1>
          <p className="text-slate-600">
            Prati status svojih aplikacija za oglase
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-600 mb-4">Nemaš aplikacija</p>
            <button
              onClick={() => navigate('/jobs')}
              className="px-6 py-2 rounded-full bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-500 transition"
            >
              Pretrazi oglase
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className={`border-2 rounded-2xl p-6 transition hover:shadow-lg ${getStatusColor(
                  app.status
                )}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-slate-950">
                      {app.Job?.title || 'Oglas'}
                    </h3>
                    {app.Job?.Company && (
                      <p className="text-slate-600 mt-1">
                        {app.Job.Company.companyName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusIcon(app.status)}
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        Status
                      </p>
                      <p className="font-bold text-slate-900">
                        {getStatusLabel(app.status)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {app.Job?.location && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        Lokacija
                      </p>
                      <p className="text-slate-700 font-medium">
                        {app.Job.location}
                      </p>
                    </div>
                  )}
                  {app.Job?.jobType && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        Tip Posla
                      </p>
                      <p className="text-slate-700 font-medium">
                        {app.Job.jobType}
                      </p>
                    </div>
                  )}
                  {app.Job?.salary && (
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">
                        Plata
                      </p>
                      <p className="text-slate-700 font-medium">
                        €{app.Job.salary}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      Dato
                    </p>
                    <p className="text-slate-700 font-medium">
                      {new Date(app.appliedAt).toLocaleDateString('sr-RS')}
                    </p>
                  </div>
                </div>

                {app.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                      Tvoja Poruka
                    </p>
                    <p className="text-slate-700">{app.coverLetter}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-200 flex gap-2">
                  <button
                    onClick={() => navigate(`/job/${app.Job?.id}`)}
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                  >
                    Vidi oglas
                  </button>
                  {app.status === 'interview' && (
                    <button
                      disabled
                      className="flex-1 px-4 py-2 rounded-lg bg-emerald-200 text-emerald-900 font-semibold opacity-75"
                    >
                      Intervju zakazan! 📅
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
