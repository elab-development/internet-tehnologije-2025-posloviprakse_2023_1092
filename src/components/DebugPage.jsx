import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

export default function DebugPage() {
  const [apiLogs, setApiLogs] = useState([]);
  const [copied, setCopied] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const TOKEN = localStorage.getItem('token');

  
  const testEndpoints = [
    { name: 'Health Check', url: `${API_URL}/health`, method: 'GET' },
    { name: 'Get All Jobs', url: `${API_URL}/jobs`, method: 'GET' },
    { name: 'Get All Companies', url: `${API_URL}/companies`, method: 'GET' },
  ];

  const addLog = (endpoint, method, status, data, error) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLogs(prev => [{
      timestamp,
      endpoint,
      method,
      status,
      data,
      error
    }, ...prev]);
  };

  const testEndpoint = async (endpoint) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (TOKEN) {
        headers['Authorization'] = `Bearer ${TOKEN}`;
      }

      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers
      });

      const data = await response.json();
      addLog(endpoint.url, endpoint.method, response.status, data, null);
    } catch (error) {
      addLog(endpoint.url, endpoint.method, 'ERROR', null, error.message);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-display font-bold text-white mb-3">
             DEBUG PAGE
          </h1>
          <p className="text-xl text-slate-300">
            Test API endpoints i vidi live response-e
          </p>
        </div>

        {/* Configuration */}
        <div className="mb-12 bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6"> Konfiguracija</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* API URL */}
            <div>
              <p className="text-slate-400 text-sm mb-2">API URL</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={API_URL}
                  readOnly
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-200 rounded font-mono text-xs border border-slate-600"
                />
                <button
                  onClick={() => copyToClipboard(API_URL, 'api-url')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded transition"
                >
                  {copied === 'api-url' ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-slate-400 text-sm mb-2">JWT Token</p>
              <div className="flex gap-2">
                <div className="flex-1 px-4 py-2 bg-slate-700 text-slate-200 rounded font-mono text-xs border border-slate-600">
                  {TOKEN ? (
                    <span className="text-emerald-400">
                       {TOKEN.substring(0, 20)}...
                    </span>
                  ) : (
                    <span className="text-red-400"> Nema tokena - Niste login-ovani</span>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="text-slate-400 text-sm mb-2">Trenutni Korisnik</p>
              <div className="px-4 py-2 bg-slate-700 text-slate-200 rounded font-mono text-xs border border-slate-600 max-h-[100px] overflow-auto">
                {localStorage.getItem('user') ? (
                  <pre>{JSON.stringify(JSON.parse(localStorage.getItem('user')), null, 2)}</pre>
                ) : (
                  <span className="text-red-400"> Nema ulogovanog korisnika</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6"> Test Endpoints</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {testEndpoints.map((endpoint) => (
              <button
                key={endpoint.url}
                onClick={() => testEndpoint(endpoint)}
                className="p-4 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/20 px-2 py-1 rounded">
                    {endpoint.method}
                  </span>
                  <span className="text-white font-semibold text-sm">{endpoint.name}</span>
                </div>
                <p className="text-slate-400 text-xs font-mono truncate">
                  {endpoint.url}
                </p>
              </button>
            ))}

            <div className="md:col-span-2 p-4 bg-slate-800 border border-slate-700 rounded-lg">
              <h3 className="text-white font-bold mb-4">Custom Endpoint</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="custom-endpoint"
                  placeholder="/jobs, /companies, itd..."
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-200 rounded font-mono text-sm border border-slate-600 focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={() => {
                    const endpoint = (document.getElementById('custom-endpoint')).value;
                    if (endpoint) {
                      testEndpoint({ name: 'Custom', url: API_URL + endpoint, method: 'GET' });
                    }
                  }}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition font-semibold"
                >
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white"> API Log</h2>
            <button
              onClick={() => setApiLogs([])}
              className="text-xs px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
            >
              Obriši Log
            </button>
          </div>

          {apiLogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Nema logova. Test neki endpoint!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-auto">
              {apiLogs.map((log, i) => (
                <div key={i} className="p-4 bg-slate-700 rounded border border-slate-600">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs mb-1">{log.timestamp}</p>
                      <p className="text-white font-mono text-sm break-all">{log.endpoint}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap ${
                      log.error ? 'bg-red-500/30 text-red-400' :
                      log.status >= 200 && log.status < 300 ? 'bg-emerald-500/30 text-emerald-400' :
                      log.status >= 400 ? 'bg-red-500/30 text-red-400' :
                      'bg-yellow-500/30 text-yellow-400'
                    }`}>
                      {log.error ? 'ERROR' : log.status}
                    </span>
                  </div>

                  {log.data && (
                    <div className="mb-3 p-3 bg-slate-800 rounded border border-slate-600">
                      <p className="text-emerald-400 text-xs font-mono font-bold mb-2">Response:</p>
                      <pre className="text-slate-200 text-xs overflow-auto max-h-[200px] font-mono">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {log.error && (
                    <div className="p-3 bg-red-900/30 rounded border border-red-700">
                      <p className="text-red-400 text-xs font-mono break-all">{log.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 p-6 bg-slate-800 border border-slate-700 rounded-2xl">
          <h3 className="text-white font-bold mb-4"> Brzi Linkovi</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <a href="/" className="px-4 py-2 bg-slate-700 text-slate-200 rounded text-center text-sm hover:bg-slate-600 transition">
              Home
            </a>
            <a href="/jobs" className="px-4 py-2 bg-slate-700 text-slate-200 rounded text-center text-sm hover:bg-slate-600 transition">
              Jobs
            </a>
            <a href="/profile" className="px-4 py-2 bg-slate-700 text-slate-200 rounded text-center text-sm hover:bg-slate-600 transition">
              Profile
            </a>
            <a href="/admin-console" className="px-4 py-2 bg-red-600 text-white rounded text-center text-sm hover:bg-red-700 transition">
              Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
