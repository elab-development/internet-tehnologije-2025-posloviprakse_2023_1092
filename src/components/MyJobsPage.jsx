import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import { Trash2, Archive, MapPin, Briefcase, DollarSign, AlertCircle, CheckCircle, Edit2, X } from 'lucide-react';

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningJobId, setActioningJobId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    // Samo kompanije i alumni mogu pristupiti ovoj stranici
    if (!token || !user || (user.role !== 'company' && user.role !== 'alumni')) {
      navigate('/');
      return;
    }

    fetchMyJobs();
  }, [authLoading, token, user, navigate]);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await jobsAPI.getMyJobs();
      setJobs(response.data || []);
    } catch (err) {
      console.error('Greška pri učitavanju oglasa:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (jobId) => {
    if (!window.confirm('Da li ste sigurni da želite da arhivirate ovaj oglas?')) {
      return;
    }

    try {
      setActioningJobId(jobId);
      await jobsAPI.archive(jobId);
      // Ažuriraj lokalni state
      setJobs(
        jobs.map((job) =>
          job.id === jobId ? { ...job, isArchived: true } : job
        )
      );
    } catch (err) {
      setError('Greška pri arhiviranju oglasa');
      console.error(err);
    } finally {
      setActioningJobId(null);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj oglas? Ova akcija se ne može vratiti!')) {
      return;
    }

    try {
      setActioningJobId(jobId);
      await jobsAPI.delete(jobId);
      // Uklonji oglas iz state-a
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setError('Greška pri brisanju oglasa');
      console.error(err);
    } finally {
      setActioningJobId(null);
    }
  };

  const handleEditClick = (job) => {
    setEditingJob(job.id);
    setEditFormData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary || '',
      jobType: job.jobType,
      experienceLevel: job.experienceLevel,
      requiredSkills: (job.requiredSkills || []).join(', ')
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setActioningJobId(editingJob);
      const skillsArray = editFormData.requiredSkills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
      
      await jobsAPI.update(editingJob, {
        ...editFormData,
        requiredSkills: skillsArray
      });
      
      // Ažuriraj lokalni state
      setJobs(
        jobs.map((job) =>
          job.id === editingJob
            ? { ...job, ...editFormData, requiredSkills: skillsArray }
            : job
        )
      );
      setEditingJob(null);
      setError('');
    } catch (err) {
      setError('Greška pri ažuriranju oglasa');
      console.error(err);
    } finally {
      setActioningJobId(null);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filtriraj oglase
  const filteredJobs = showArchived 
    ? jobs.filter((job) => job.isArchived) 
    : jobs.filter((job) => !job.isArchived);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Učitavanje oglasa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Moji oglasi</h1>
          <p className="text-gray-600">Upravljajte vašim objavljenim oglas</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              !showArchived
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Aktivni oglasi ({jobs.filter((j) => !j.isArchived).length})
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              showArchived
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Arhivirani ({jobs.filter((j) => j.isArchived).length})
          </button>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {showArchived 
                ? 'Nemate arhiviranih oglasa' 
                : 'Nemate aktivnih oglasa'}
            </p>
            {!showArchived && (
              <button
                onClick={() => navigate('/create-job')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Kreiraj novi oglas
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.jobType}
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {new Intl.NumberFormat('sr-RS', {
                            style: 'currency',
                            currency: 'RSD'
                          }).format(job.salary)}/mesec
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="ml-4">
                    {job.isArchived ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <AlertCircle className="h-4 w-4" />
                        Arhiviran
                      </span>
                    ) : job.approvalStatus === 'approved' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Odobren
                      </span>
                    ) : job.approvalStatus === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                        <AlertCircle className="h-4 w-4" />
                        Na čekanju
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        Odbijena
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                {/* Required Skills */}
                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Tražene veštine:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {!job.isArchived ? (
                    <>
                      <button
                        onClick={() => navigate(`/job/${job.id}`)}
                        className="flex-1 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                      >
                        Pregled
                      </button>
                      <button
                        onClick={() => handleEditClick(job)}
                        disabled={actioningJobId === job.id}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Uredi
                      </button>
                      <button
                        onClick={() => handleArchive(job.id)}
                        disabled={actioningJobId === job.id}
                        className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                      >
                        <Archive className="h-4 w-4" />
                        Arhiviraj
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        disabled={actioningJobId === job.id}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Obriši
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={actioningJobId === job.id}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Obriši trajno
                    </button>
                  )}
                </div>

                {/* Edit Modal */}
                {editingJob === job.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Uredi oglas</h2>
                        <button
                          onClick={() => setEditingJob(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Naslov
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={editFormData.title}
                            onChange={handleEditChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Opis
                          </label>
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Lokacija
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={editFormData.location}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Plata (RSD)
                            </label>
                            <input
                              type="number"
                              name="salary"
                              value={editFormData.salary}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tip posla
                            </label>
                            <select
                              name="jobType"
                              value={editFormData.jobType}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Temporary">Temporary</option>
                              <option value="Internship">Internship</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nivo iskustva
                            </label>
                            <select
                              name="experienceLevel"
                              value={editFormData.experienceLevel}
                              onChange={handleEditChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Entry">Entry</option>
                              <option value="Mid">Mid</option>
                              <option value="Senior">Senior</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tražene veštine (odvojeno zarezima)
                          </label>
                          <input
                            type="text"
                            name="requiredSkills"
                            value={editFormData.requiredSkills}
                            onChange={handleEditChange}
                            placeholder="React, Node.js, PostgreSQL"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="flex gap-4 pt-6">
                          <button
                            type="submit"
                            disabled={actioningJobId === job.id}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            {actioningJobId === job.id ? 'Čuva se...' : 'Sačuvaj promene'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingJob(null)}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Otkaži
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
