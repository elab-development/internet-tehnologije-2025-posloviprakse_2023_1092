import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, Clock, Search, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';

export default function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    category: ''
  });

  // Konstante
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
  const experienceLevels = ['Entry', 'Mid', 'Senior'];
  const categories = ['IT', 'Marketing', 'Sales', 'Design', 'HR', 'Finance', 'Other'];

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('🔍 Počinjem učitavanje poslova...');
      console.log('📍 API URL:', import.meta.env.VITE_API_URL);
      
      const data = await jobsAPI.getAll(filters);
      console.log('✅ Podaci primljeni:', data);
      
      setJobs(data.data || data);
      setError('');
    } catch (err) {
      console.error('❌ Greška pri učitavanju:', err);
      setError('Nije moguće učitati oglase. Pokušaj ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      category: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-950 mb-2">Svi Oglasi</h1>
          <p className="text-slate-600">Pronađi savršenu praksu ili posao za sebe</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Pretraži oglase..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-300 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-2xl shadow border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-950">Filteri</h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Očisti
                </button>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 block mb-3">Lokacija</label>
                <input
                  type="text"
                  placeholder="npr. Beograd"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-400 text-sm"
                />
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 block mb-3">Tip Angažmana</label>
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-400 text-sm"
                >
                  <option value="">Sve</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Experience Level Filter */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 block mb-3">Iskustvo</label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-400 text-sm"
                >
                  <option value="">Svi nivoi</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700 block mb-3">Kategorija</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-400 text-sm"
                >
                  <option value="">Sve kategorije</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-6 w-full px-4 py-3 rounded-full border border-slate-300 text-slate-700 font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition"
            >
              <Filter size={20} />
              {showFilters ? 'Sakrij' : 'Prikaži'} Filtere
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                <p className="text-slate-600">Učitavanje oglasa...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl shadow border border-slate-100 p-12 text-center">
                <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Nema oglasa</h3>
                <p className="text-slate-600">Pokušaj sa drugačijim filterima</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <Link
                    key={job.id}
                    to={`/job/${job.id}`}
                    className="block bg-white rounded-2xl shadow border border-slate-100 hover:shadow-lg hover:border-emerald-200 transition p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-950 hover:text-emerald-600 transition">
                          {job.title}
                        </h3>
                        <p className="text-slate-600 text-sm mt-1">
                          {job.company?.companyName || 'Kompanija'}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      {job.location && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin size={16} className="text-emerald-500" />
                          {job.location}
                        </div>
                      )}
                      {job.jobType && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={16} className="text-emerald-500" />
                          {job.jobType}
                        </div>
                      )}
                      {job.experienceLevel && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Briefcase size={16} className="text-emerald-500" />
                          {job.experienceLevel}
                        </div>
                      )}
                    </div>

                    {job.category && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                          {job.category}
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
