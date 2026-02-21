import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, applicationsAPI } from '../services/api';
import { Clock, CheckCircle, XCircle, AlertCircle, Users, Briefcase } from 'lucide-react';

export default function ApplicationsPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError] = useState('');
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

  useEffect(() => {
    if (authLoading) {
      return;
    }

    
    if (!token || !user || user.role !== 'company') {
      navigate('/');
      return;
    }

    fetchMyJobs();
  }, [authLoading, token, user, navigate]);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsAPI.getMyJobs();
      setJobs(response.data || []);
      
      if (response.data && response.data.length > 0) {
        setSelectedJob(response.data[0].id);
        fetchApplicationsForJob(response.data[0].id);
      }
    } catch (err) {
      console.error('Greška pri učitavanju oglasa:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsForJob = async (jobId) => {
    try {
      setLoadingApps(true);
      const response = await applicationsAPI.getApplicationsForJob(jobId);
      setApplications(response.data || []);
    } catch (err) {
      console.error('Greška pri učitavanju aplikacija:', err);
      setError(err.message);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleJobSelect = (jobId) => {
    setSelectedJob(jobId);
    fetchApplicationsForJob(jobId);
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      setUpdatingAppId(appId);
      await applicationsAPI.updateStatus(appId, newStatus);
      
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setError('Greška pri ažuriranju statusa');
      console.error(err);
    } finally {
      setUpdatingAppId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      applied: { icon: Clock, color: 'bg-blue-100 text-blue-700', label: 'Aplikacija' },
      reviewing: {
        icon: AlertCircle,
        color: 'bg-yellow-100 text-yellow-700',
        label: 'U pregledu'
      },
      interview: {
        icon: Briefcase,
        color: 'bg-purple-100 text-purple-700',
        label: 'Intervju'
      },
      accepted: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700',
        label: 'Prihvaćen/a'
      },
      rejected: {
        icon: XCircle,
        color: 'bg-red-100 text-red-700',
        label: 'Odbijen'
      }
    };

    const badge = badges[status] || badges.applied;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
        <Icon size={16} />
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Učitavanje oglasa...</p>
        </div>
      </div>
    );
  }

  const selectedJobData = jobs.find((j) => j.id === selectedJob);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-slate-950 mb-2">
             Aplikacije
          </h1>
          <p className="text-slate-600">
            Upravljaj aplikacijama na sve objavljivane oglase
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-600 mb-4">Nemaš niti jedan oglas</p>
            <button
              onClick={() => navigate('/create-job')}
              className="px-6 py-2 rounded-full bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-500 transition"
            >
              Kreiraj prvi oglas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden sticky top-24">
                <div className="bg-emerald-50 p-4 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900">Moji Oglasi</h2>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => handleJobSelect(job.id)}
                      className={`w-full text-left p-4 border-b border-slate-100 hover:bg-emerald-50 transition ${
                        selectedJob === job.id
                          ? 'bg-emerald-100 border-l-4 border-l-emerald-500'
                          : ''
                      }`}
                    >
                      <p className="font-semibold text-slate-900 truncate">
                        {job.title}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                         {job.location}
                      </p>
                      <div className="mt-2 inline-block bg-slate-200 px-2 py-1 rounded text-xs font-semibold text-slate-700">
                        {selectedJob === job.id ? applications.length : '...'} aplikacija
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedJobData && (
                <div>
                  <div className="bg-white rounded-2xl shadow border border-slate-100 p-6 mb-6">
                    <h2 className="text-2xl font-bold text-slate-950 mb-2">
                      {selectedJobData.title}
                    </h2>
                    <div className="flex gap-4 text-slate-600 mb-4">
                      <span> {selectedJobData.location}</span>
                      <span> {selectedJobData.jobType}</span>
                      {selectedJobData.salary && <span>€ {selectedJobData.salary}</span>}
                    </div>
                    <button
                      onClick={() => navigate(`/job/${selectedJob}`)}
                      className="px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-slate-300 transition"
                    >
                      Vidi oglas
                    </button>
                  </div>

                  {loadingApps ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-2"></div>
                      <p className="text-slate-600">Učitavanje aplikacija...</p>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">Nema aplikacija na ovaj oglas</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => {
                        const applicant = app.jobSeeker || app.JobSeeker;
                        const applicantUser = applicant?.user || applicant?.User;
                        const cvUrl = app.cvUrl || app.cv_url || applicant?.cv_url;
                        const cvFilename = app.cvFilename || app.cv_filename || applicant?.cv_filename || 'CV';
                        const resolvedCvUrl = cvUrl
                          ? (cvUrl.startsWith('http://') || cvUrl.startsWith('https://') || cvUrl.startsWith('data:')
                              ? cvUrl
                              : `${apiBase}${cvUrl}`)
                          : null;

                        return (
                          <div
                            key={app.id}
                            className="bg-white rounded-2xl shadow border border-slate-100 p-6 hover:shadow-lg transition"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-grow">
                                <h3 className="text-lg font-bold text-slate-950">
                                  {applicantUser?.firstName} {applicantUser?.lastName}
                                </h3>
                                <p className="text-slate-600 text-sm">
                                  {applicantUser?.email}
                                </p>
                                {applicant?.phone && (
                                  <p className="text-slate-600 text-sm">
                                     {applicant.phone}
                                  </p>
                                )}
                                {applicant?.location && (
                                  <p className="text-slate-600 text-sm">
                                     {applicant.location}
                                  </p>
                                )}
                              </div>
                              <div>{getStatusBadge(app.status)}</div>
                            </div>

                            {applicant?.skills && applicant.skills.length > 0 && (
                              <div className="mb-4 pb-4 border-b border-slate-100">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                                  Veštine
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {applicant.skills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {app.coverLetter && (
                              <div className="mb-4 pb-4 border-b border-slate-100">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                                  Poruka
                                </p>
                                <p className="text-slate-700 text-sm">{app.coverLetter}</p>
                              </div>
                            )}

                            {resolvedCvUrl && (
                              <div className="mb-4">
                                <a
                                  href={resolvedCvUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                                >
                                   Preuzmi CV ({cvFilename})
                                </a>
                              </div>
                            )}

                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() =>
                                handleStatusUpdate(app.id, 'reviewing')
                              }
                              disabled={updatingAppId === app.id}
                              className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition text-sm disabled:opacity-50"
                            >
                              U pregledu
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(app.id, 'interview')
                              }
                              disabled={updatingAppId === app.id}
                              className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition text-sm disabled:opacity-50"
                            >
                              Zakaži intervju
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(app.id, 'accepted')
                              }
                              disabled={updatingAppId === app.id}
                              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition text-sm disabled:opacity-50"
                            >
                              Prihvati
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(app.id, 'rejected')
                              }
                              disabled={updatingAppId === app.id}
                              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition text-sm disabled:opacity-50"
                            >
                              Odbij
                            </button>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
