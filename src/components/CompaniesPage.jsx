import React, { useState, useEffect } from 'react';
import { Building2, Users, Briefcase, Globe, ArrowRight, Search } from 'lucide-react';
import { companiesAPI } from '../services/api';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companiesAPI.getAll();
      setCompanies(data);
      setFilteredCompanies(data);
    } catch (err) {
      console.error('Greška pri učitavanju kompanije:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = companies.filter(company => 
      company.companyName?.toLowerCase().includes(term) ||
      company.description?.toLowerCase().includes(term) ||
      company.industry?.toLowerCase().includes(term) ||
      company.location?.toLowerCase().includes(term)
    );
    setFilteredCompanies(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <Building2 className="text-emerald-600" size={28} />
            </div>
          </div>
          <h1 className="text-5xl font-display font-bold text-slate-950 mb-6">
            Istaknute Kompanije
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Pronađi idealne poslodavce i saznaj više o kompanijama koje nude mogućnosti za развој
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Pretraži kompanije po imenu, industriji ili lokaciji..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-200 rounded-full focus:outline-none focus:border-emerald-400 transition text-lg"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="helix-skeleton rounded-2xl h-80 bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Companies Grid */}
            {filteredCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="group bg-white rounded-3xl shadow-lg border border-slate-100 hover:shadow-xl transition overflow-hidden"
                  >
                    {/* Header */}
                    <div className="h-32 bg-gradient-to-r from-emerald-400 to-blue-500 p-6 flex items-start justify-between">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                        <Building2 className="text-white" size={32} />
                      </div>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                        >
                          <Globe size={20} />
                        </a>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-950 mb-2 truncate">
                        {company.companyName}
                      </h3>
                      
                      {company.industry && (
                        <p className="text-sm text-emerald-600 font-semibold mb-3">
                          {company.industry}
                        </p>
                      )}

                      {company.description && (
                        <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                          {company.description}
                        </p>
                      )}

                      {company.location && (
                        <p className="text-slate-500 text-sm mb-4 flex items-center gap-2">
                           {company.location}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-t border-b border-slate-100">
                        <div className="text-center">
                          <p className="text-slate-500 text-xs mb-1">Oglasi</p>
                          <p className="text-2xl font-bold text-emerald-600">
                            {company.jobCount || 0}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-500 text-xs mb-1">Primene</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {company.applicationCount || 0}
                          </p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <a
                        href="/"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold rounded-full transition group-hover:gap-3"
                      >
                        Vidi Oglase
                        <ArrowRight size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Building2 className="mx-auto text-slate-300 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-slate-950 mb-2">
                  Nema pronađenih kompanije
                </h3>
                <p className="text-slate-600 mb-6">
                  Pokušaj sa drugom pretragom ili prikazi sve kompanije
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilteredCompanies(companies);
                  }}
                  className="px-6 py-3 bg-emerald-400 text-slate-950 font-bold rounded-full hover:bg-emerald-500 transition"
                >
                  Prikaži Sve Kompanije
                </button>
              </div>
            )}
          </>
        )}

        {/* Info Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-3xl p-12 border border-emerald-200">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-display font-bold text-slate-950 mb-6">
                Registruj svoju Kompaniju
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Pridruži se sa stotinama kompanije koje već koriste Jobzee za pronalaženje najboljih talenta
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-2xl p-6">
                  <Briefcase className="text-emerald-600 mx-auto mb-4" size={32} />
                  <h3 className="font-bold text-slate-950 mb-2">Postavljanje Oglasa</h3>
                  <p className="text-sm text-slate-600">
                    Kreiraj i upravljaj oglasima u sekundi
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <Users className="text-blue-600 mx-auto mb-4" size={32} />
                  <h3 className="font-bold text-slate-950 mb-2">Pronađi Talente</h3>
                  <p className="text-sm text-slate-600">
                    Pronađi najispravnije kandidate za tvoje timove
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <Globe className="text-purple-600 mx-auto mb-4" size={32} />
                  <h3 className="font-bold text-slate-950 mb-2">Globalna Dostupnost</h3>
                  <p className="text-sm text-slate-600">
                    Dostangi kvalitetne kandidate iz celog regiona
                  </p>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/'}
                className="px-8 py-4 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold rounded-full transition text-lg"
              >
                Započni Sada
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
