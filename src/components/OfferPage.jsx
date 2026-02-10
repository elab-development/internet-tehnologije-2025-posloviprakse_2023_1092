import React, { useState, useEffect } from 'react';
import { Check, Sparkles, ShieldCheck, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const roles = [
  {
    name: 'Student',
    badge: 'Traži posao ili praksu',
    description: 'Pronađi savršenu praksu ili svoj prvi posao uz pomoć moderisanih oglasa.',
    features: [
      'Napredna pretraga oglasa',
      'Filtriranje po lokaciji, tipu i iskustvu',
      'Prijava na poslove i prakse',
      'CV upload i privatni profil',
      'Praćenje aplikacija'
    ]
  },
  {
    name: 'Alumni',
    badge: 'Karijeru gradim dalje',
    description: 'Putem za sve - od rasta u postojećoj karijeri do pokretanja своје priče.',
    features: [
      'Sve kao Student, plus:',
      'Objavljuj oglase za druge talente',
      'Pristup admin pregledu oglasa',
      'Privatne grupe i networking'
    ]
  },
  {
    name: 'Kompanija',
    badge: 'Zaposli talente',
    description: 'Postavi oglase i pronađi najbolje kandidate za tvoj tim brzo i efikasno.',
    features: [
      'Kreiraj i upravljaj oglasima',
      'Pregled prijava i kandidata',
      'Prate CV i portfolije',
      'Brendiranje kompanije',
      'Moderisani oglasi za kvalitet'
    ]
  }
];

const perks = [
  {
    title: 'Pametna pretraga',
    desc: 'Filtriraj po lokaciji, tipu angažmana i nivou iskustva za par sekundi.'
  },
  {
    title: 'Moderacija oglasa',
    desc: 'Svaki oglas prolazi admin proveru kako bi kvalitet ostao visok.'
  },
  {
    title: 'Brzi shortlist',
    desc: 'Kompanije lako porede kandidate i upravljaju prijavama u toku.'
  },
  {
    title: 'Bezbedan nalog',
    desc: 'JWT autentifikacija i verifikacija emaila cuvaju nalog sigurnim.'
  }
];

const OfferPage = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isAuthenticated, isCompany } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        console.log('🔍 Fetching jobs from:', `${API_URL}/jobs?limit=4`);
        const response = await fetch(`${API_URL}/jobs?limit=4`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Jobs data received:', data);
        
        if (data.success && Array.isArray(data.data)) {
          setFeaturedJobs(data.data.slice(0, 4));
          console.log('✅ Featured jobs set:', data.data.length);
        } else {
          console.warn('⚠️ Unexpected data format:', data);
          setFeaturedJobs([]);
        }
      } catch (error) {
        console.error('❌ Error fetching featured jobs:', error);
        setFeaturedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);
  return (
    <div className="bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f766e_0%,transparent_55%)] opacity-60" />
        <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 animate-fade-in-up">
              <span className="px-4 py-2 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold uppercase tracking-wider">
                Platforma za karijeru
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-bold bg-gradient-to-br from-emerald-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent animate-fade-in-up leading-tight" style={{animationDelay: '0.1s'}}>
              Jobzee
            </h1>
            <p className="mt-6 md:mt-8 text-lg sm:text-xl md:text-2xl text-slate-200 font-medium leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Jedna platforma za posao, praksu i prave talente
            </p>
            <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Spajamo studente, alumni i kompanije kroz moderisane oglase i transparentan proces prijave.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              {isAuthenticated() && (isCompany() || user?.role === 'alumni') ? (
                <Link
                  to="/create-job"
                  className="px-8 py-4 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 hover:scale-105 transition-all duration-300 text-lg shadow-lg hover:shadow-emerald-400/50"
                >
                  Postavi oglas
                </Link>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-8 py-4 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 hover:scale-105 transition-all duration-300 text-lg shadow-lg hover:shadow-emerald-400/50"
                >
                  Postavi oglas
                </button>
              )}
              <Link
                to="/jobs"
                className="px-8 py-4 rounded-full border-2 border-white/20 text-white hover:border-emerald-400 hover:bg-emerald-400/10 hover:scale-105 transition-all duration-300 text-lg"
              >
                Pretraži oglase
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/60 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-300">
              <Sparkles size={20} />
              <span className="uppercase text-xs tracking-widest">Zasto Jobzee</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold">Kreirano za brze odluke.</h2>
            <p className="text-slate-300">
              Fokus na kvalitetne oglase i jasne informacije. Bez buke, bez spam oglasa.
              Sve sto je potrebno da zaposlis ili nadjes praksu nalazi se ovde.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {perks.map((perk) => (
              <div key={perk.title} className="rounded-2xl bg-slate-950/80 border border-white/5 p-5">
                <h3 className="font-semibold text-white mb-2">{perk.title}</h3>
                <p className="text-sm text-slate-300">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-emerald-300 uppercase text-xs tracking-widest">Uloge</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold">Ko si? Šta želiš da postigneš?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <div
                key={role.name}
                className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 flex flex-col hover:border-emerald-300/60 hover:bg-slate-900/60 transition"
              >
                <span className="text-xs uppercase tracking-widest text-emerald-300">{role.badge}</span>
                <h3 className="mt-4 text-2xl font-semibold">{role.name}</h3>
                <p className="mt-4 text-sm text-slate-300">{role.description}</p>
                <ul className="mt-6 space-y-3 text-sm flex-grow">
                  {role.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check size={16} className="text-emerald-300 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {isAuthenticated() ? (
                  role.name === 'Kompanija' || role.name === 'Alumni' ? (
                    <Link
                      to="/create-job"
                      className="mt-8 text-center px-5 py-3 rounded-full font-semibold bg-white/10 text-white hover:bg-emerald-300 hover:text-slate-900 transition"
                    >
                      Postavi oglas
                    </Link>
                  ) : (
                    <Link
                      to="/jobs"
                      className="mt-8 text-center px-5 py-3 rounded-full font-semibold bg-white/10 text-white hover:bg-emerald-300 hover:text-slate-900 transition"
                    >
                      Pretraži oglase
                    </Link>
                  )
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="mt-8 text-center px-5 py-3 rounded-full font-semibold bg-white/10 text-white hover:bg-emerald-300 hover:text-slate-900 transition w-full"
                  >
                    {role.name === 'Student' && 'Kreni besplatno'}
                    {role.name === 'Alumni' && 'Uloguj se kao Alumni'}
                    {role.name === 'Kompanija' && 'Postavi oglas'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950/90 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-emerald-300 uppercase text-xs tracking-widest">Aktuelni oglasi</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold">
                Ponude od provjerenih kompanija
              </h2>
              <p className="mt-4 text-slate-300">
                Primjeri oglasa koji su trenutno aktivni na platformi.
              </p>
            </div>
            <Link
              to="/jobs"
              className="px-6 py-3 rounded-full border border-white/20 text-white hover:border-white/60 transition"
            >
              Vidi sve oglase
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-2 text-center py-12 text-slate-400">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-400 border-r-transparent"></div>
                <p className="mt-4">Učitavanje oglasa...</p>
              </div>
            ) : featuredJobs.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <div className="max-w-md mx-auto">
                  <p className="text-slate-400 text-lg mb-4">Trenutno nema dostupnih oglasa</p>
                  <Link
                    to="/create-job"
                    className="inline-flex px-6 py-3 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition"
                  >
                    Budi prvi i postavi oglas
                  </Link>
                </div>
              </div>
            ) : (
              featuredJobs.map((job, index) => (
                <Link
                  key={job.id}
                  to={`/job/${job.id}`}
                  className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 hover:border-emerald-300/60 hover:bg-slate-900/70 hover:scale-105 transition-all duration-300 block animate-fade-in-up"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-emerald-300">
                      {job.company?.companyName || job.Company?.companyName || 'Kompanija'}
                    </span>
                    <span className="text-xs text-slate-400">{job.location}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{job.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="px-3 py-1 rounded-full bg-white/10">{job.jobType}</span>
                    <span className="px-3 py-1 rounded-full bg-white/10">{job.experienceLevel}</span>
                  </div>
                  <div className="mt-6 inline-flex items-center text-emerald-300 hover:text-emerald-200 font-semibold">
                    Pogledaj oglas
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="bg-slate-900/70 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-950/70 p-6 border border-white/5">
              <Rocket className="text-emerald-300" />
              <h3 className="mt-4 text-xl font-semibold">Brz onboarding</h3>
              <p className="text-sm text-slate-300 mt-2">Postavljanje profila traje manje od 10 minuta.</p>
            </div>
            <div className="rounded-2xl bg-slate-950/70 p-6 border border-white/5">
              <ShieldCheck className="text-emerald-300" />
              <h3 className="mt-4 text-xl font-semibold">Sigurna infrastruktura</h3>
              <p className="text-sm text-slate-300 mt-2">Oglasi su verifikovani, podaci zasticeni.</p>
            </div>
            <div className="rounded-2xl bg-slate-950/70 p-6 border border-white/5">
              <Sparkles className="text-emerald-300" />
              <h3 className="mt-4 text-xl font-semibold">Bolji match</h3>
              <p className="text-sm text-slate-300 mt-2">AI-ready profili za precizniji izbor kandidata.</p>
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default OfferPage;
