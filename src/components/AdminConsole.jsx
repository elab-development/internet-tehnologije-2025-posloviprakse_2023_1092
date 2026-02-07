import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Database, RefreshCw, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI, jobsAPI } from '../services/api';

export default function AdminConsole() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('connections');
  const [connections, setConnections] = useState({
    database: 'unknown',
    api: 'unknown',
    backend: 'unknown'
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    setLoading(true);
    try {
      // Get API URL from environment or use default
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const healthCheckUrl = apiBaseUrl.replace('/api', '') + '/api/health';
      
      console.log('🔍 Health check URL:', healthCheckUrl);
      
      // Check Backend + Database via health endpoint
      const healthCheck = await fetch(healthCheckUrl).catch((err) => {
        console.error('Health check fetch error:', err);
        return null;
      });
      
      console.log('📊 Health check response:', healthCheck?.status, healthCheck?.statusText);
      
      if (healthCheck?.ok) {
        const healthData = await healthCheck.json();
        
        console.log('✅ Health data:', healthData);
        
        setConnections(prev => ({
          ...prev,
          backend: 'CONNECTED ✅',
          database: healthData.database === 'CONNECTED' ? 'CONNECTED ✅' : 'DISCONNECTED ❌',
          api: 'CONNECTED ✅'
        }));
        
        // Fetch data if everything is connected
        if (healthData.database === 'CONNECTED') {
          await fetchAllData();
        }
      } else {
        console.log('❌ Health check failed:', healthCheck?.status);
        setConnections(prev => ({
          ...prev,
          backend: 'DISCONNECTED ❌',
          database: 'DISCONNECTED ❌',
          api: 'DISCONNECTED ❌'
        }));
      }
    } catch (err) {
      console.error('Error checking connections:', err);
      setConnections(prev => ({
        ...prev,
        backend: 'ERROR ⚠️',
        database: 'ERROR ⚠️',
        api: 'ERROR ⚠️'
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      console.log('📥 Fetching admin data...');
      
      // Try to fetch users via API service
      try {
        console.log('👥 Fetching users from API...');
        const usersData = await adminAPI.getAllUsers();
        console.log('✅ Users data received:', usersData);
        const userData = usersData.data?.users || usersData.data || [];
        console.log('📋 Processed users:', userData);
        setUsers(Array.isArray(userData) ? userData : []);
      } catch (err) {
        console.error('❌ Cannot fetch users:', err.message, err.response?.data || err);
      }

      // Try to fetch jobs
      try {
        console.log('📑 Fetching jobs from API...');
        const jobsData = await jobsAPI.getAll();
        console.log('✅ Jobs data received:', jobsData);
        const jobsList = jobsData.data || [];
        console.log('📋 Processed jobs:', jobsList);
        setJobs(Array.isArray(jobsList) ? jobsList : []);
      } catch (err) {
        console.error('❌ Cannot fetch jobs:', err.message, err);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    try {
      setDeleting(true);
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setDeleteConfirm(null);
      alert(`✅ Korisnik ${userName} je brisan`);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(`❌ Greška pri brisanju korisnika: ${err.response?.data?.message || err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    try {
      setDeleting(true);
      await adminAPI.deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
      setDeleteConfirm(null);
      alert(`✅ Oglas "${jobTitle}" je brisan`);
    } catch (err) {
      console.error('Error deleting job:', err);
      alert(`❌ Greška pri brisanju oglasa: ${err.response?.data?.message || err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
              <Database className="text-red-500" size={28} />
            </div>
          </div>
          <h1 className="text-5xl font-display font-bold text-white mb-3">
            🛠️ Admin Console
          </h1>
          <p className="text-xl text-slate-300">
            Pregled sistema, baze podataka i konfiguracije
          </p>
        </div>

        {/* Refresh Button */}
        <button
          onClick={checkConnections}
          disabled={loading}
          className="mb-8 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          Osvezi Status
        </button>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('connections')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'connections'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            🔌 Status Konekcije
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'users'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            👥 Korisnici ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'jobs'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            💼 Oglasi ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'config'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            ⚙️ Konfiguracija
          </button>
        </div>

        {/* Content */}
        {activeTab === 'connections' && (
          <div className="space-y-4">
            <ConnectionCard
              name="PostgreSQL Baza"
              status={connections.database}
              icon="🗄️"
              details={{
                Host: 'localhost',
                Port: '5432',
                Database: 'jobzee_db',
                User: 'postgres'
              }}
            />
            <ConnectionCard
              name="Backend API"
              status={connections.backend}
              icon="🚀"
              details={{
                URL: 'http://localhost:5000',
                Status: connections.backend,
                Port: '5000'
              }}
            />
            <ConnectionCard
              name="Frontend API"
              status={connections.api}
              icon="🌐"
              details={{
                URL: import.meta.env.VITE_API_URL,
                Status: connections.api,
                Port: '5173'
              }}
            />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-bold">ID</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Ime</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Email</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Uloga</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Kreirano</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-6 py-4 text-slate-300">{user.id}</td>
                        <td className="px-6 py-4 text-slate-300">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === 'admin' ? 'bg-red-500/30 text-red-400' :
                            user.role === 'company' ? 'bg-blue-500/30 text-blue-400' :
                            user.role === 'alumni' ? 'bg-purple-500/30 text-purple-400' :
                            'bg-slate-500/30 text-slate-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(user.createdAt).toLocaleDateString('sr-RS')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setDeleteConfirm({ type: 'user', id: user.id, name: `${user.firstName} ${user.lastName}` })}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded text-xs font-semibold transition flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Briši
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Nema korisnika u bazi</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
            {jobs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900 border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-bold">ID</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Naslov</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Lokacija</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Tip</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Kategorija</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Kreirano</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                        <td className="px-6 py-4 text-slate-300 text-xs">{job.id}</td>
                        <td className="px-6 py-4 text-slate-300 font-semibold">{job.title}</td>
                        <td className="px-6 py-4 text-slate-400">{job.location}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                            {job.jobType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{job.category}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {new Date(job.createdAt).toLocaleDateString('sr-RS')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setDeleteConfirm({ type: 'job', id: job.id, name: job.title })}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded text-xs font-semibold transition flex items-center gap-1"
                          >
                            <Trash2 size={14} />
                            Briši
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">Nema oglasa u bazi</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConfigCard title="Frontend Konfiguracija">
              <ConfigItem label="API URL" value={import.meta.env.VITE_API_URL} />
              <ConfigItem label="App Name" value={import.meta.env.VITE_APP_NAME} />
              <ConfigItem label="Node ENV" value={process.env.NODE_ENV || 'development'} />
            </ConfigCard>

            <ConfigCard title="Browser Storage">
              <ConfigItem 
                label="Token" 
                value={localStorage.getItem('token') ? '✅ SAČUVAN' : '❌ NEMA'} 
              />
              <ConfigItem 
                label="User" 
                value={localStorage.getItem('user') ? '✅ SAČUVAN' : '❌ NEMA'} 
              />
            </ConfigCard>

            <ConfigCard title="Trenutni Korisnik">
              <ConfigItem 
                label="Status" 
                value={user ? '✅ ULOGOVAN' : '❌ ODJAVLJN'} 
              />
              {user && (
                <>
                  <ConfigItem label="Ime" value={`${user.firstName} ${user.lastName}`} />
                  <ConfigItem label="Email" value={user.email} />
                  <ConfigItem label="Uloga" value={user.role} />
                </>
              )}
            </ConfigCard>

            <ConfigCard title="System Info">
              <ConfigItem label="Browser" value={navigator.userAgent.split(' ').slice(-1)[0]} />
              <ConfigItem label="Vreme" value={new Date().toLocaleTimeString('sr-RS')} />
              <ConfigItem label="Lokalni Storage" value={`${(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB`} />
            </ConfigCard>
          </div>
        )}

        {/* Confirmation Dialog */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 className="text-red-500" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {deleteConfirm.type === 'user' ? 'Obriši korisnika?' : 'Obriši oglas?'}
                </h2>
              </div>
              <p className="text-slate-300 mb-2">
                Sigurno želite da obrišete{' '}
                <span className="font-bold text-white">{deleteConfirm.name}</span>?
              </p>
              <p className="text-slate-400 text-sm mb-6">Ova akcija se ne može nazad pozvati.</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
                >
                  Otkaži
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'user') {
                      handleDeleteUser(deleteConfirm.id, deleteConfirm.name);
                    } else {
                      handleDeleteJob(deleteConfirm.id, deleteConfirm.name);
                    }
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Briše se...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Obriši
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConnectionCard({ name, status, icon, details }) {
  const isConnected = status.includes('✅');
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          {name}
        </h3>
        <span className={`font-bold text-lg ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
          {status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(details).map(([key, value]) => (
          <div key={key}>
            <p className="text-slate-400 text-sm">{key}</p>
            <p className="text-slate-200 font-mono text-xs break-all">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigCard({ title, children }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function ConfigItem({ label, value }) {
  return (
    <div className="pb-3 border-b border-slate-700 last:border-b-0">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-slate-200 font-mono text-xs mt-1 break-all">{value}</p>
    </div>
  );
}
