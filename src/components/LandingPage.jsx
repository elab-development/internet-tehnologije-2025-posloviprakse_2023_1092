import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, CheckCircle, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="w-full">
      {/* ============= HERO SEKCIJA ============= */}
      <section className="relative w-full min-h-[80vh] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-hidden flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300 mb-4">Dobrodošli na Jobzee</p>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Pronađi Posao
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Koji Ima Smisla
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Jobzee povezuje talentovane studente i alumni sa vodećim kompanijama. Pronađi pravu praksu, posao ili tim kojem želiš da pripadaš.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/jobs"
              className="px-8 py-4 rounded-full bg-emerald-400 text-slate-950 font-bold text-lg hover:bg-emerald-300 transition flex items-center justify-center gap-2 group"
            >
              Pretrazi Oglase
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/"
              className="px-8 py-4 rounded-full border-2 border-emerald-400 text-emerald-300 font-bold text-lg hover:bg-emerald-400/10 transition"
            >
              Više Informacija
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-1">500+</div>
              <div className="text-slate-300 text-sm">Aktivnih Oglasa</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-1">2000+</div>
              <div className="text-slate-300 text-sm">Registrovanih Korisnika</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold text-emerald-400 mb-1">150+</div>
              <div className="text-slate-300 text-sm">Partnera Kompanija</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= KAKO FUNKCIONIŠE ============= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-950 mb-4">Kako Funkcioniše Jobzee?</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Jednostavno, brzo i efikasno. U samo nekoliko minuta možeš početi da tražiš ili postavljaš oglase.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Za Studente */}
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-3xl p-8 border border-emerald-200">
              <div className="w-14 h-14 rounded-full bg-emerald-400 flex items-center justify-center mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-950 mb-6">Za Studente</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-400 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Registruj se</h4>
                    <p className="text-slate-600 text-sm">Kreiraj nalog u 2 minuta sa osnovnim podacima</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-400 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Pretraži Oglase</h4>
                    <p className="text-slate-600 text-sm">Filtriraj po lokaciji, tipu posla i kategoriji</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-400 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Apliciraj</h4>
                    <p className="text-slate-600 text-sm">Pošalji svoju prijavu sa motivacionim pismom</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-400 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Počni Praksu</h4>
                    <p className="text-slate-600 text-sm">Prihvati ponudu i počni svoju karijeru</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Za Kompanije */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
              <div className="w-14 h-14 rounded-full bg-blue-400 flex items-center justify-center mb-6">
                <Briefcase className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-950 mb-6">Za Kompanije</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Postavite Oglas</h4>
                    <p className="text-slate-600 text-sm">Opišite poziciju i zahtjeve za idealno</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Primajte Prijave</h4>
                    <p className="text-slate-600 text-sm">Kandidati se prijavljivuju direktno za poziciju</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Pregledajte Profile</h4>
                    <p className="text-slate-600 text-sm">Pogledajte CV i sažetak kandidata</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Prihvatite Kandidata</h4>
                    <p className="text-slate-600 text-sm">Odaberite najboljih kandidata za svoj tim</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= PREDNOSTI ============= */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-950 mb-4">Zašto Jobzee?</h2>
            <p className="text-slate-600 text-lg">Prednosti koje te čekaju</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Brzo i Lako",
                desc: "Registracija i osnovna setup u manje od 5 minuta bez komplikovanih procedura"
              },
              {
                icon: Shield,
                title: "Sigurno",
                desc: "Tvoji podaci su zaštićeni sa što je moguće novijom sigurnosnom tehnologijom"
              },
              {
                icon: TrendingUp,
                title: "Rast Karijere",
                desc: "Pronađi pozicije koje će te voditi prema tvojim profesionalnim ciljevima"
              },
              {
                icon: CheckCircle,
                title: "Provjera Kvalitete",
                desc: "Svi oglasi se provjeravaju prije objave radi sigurnosti studenata"
              },
              {
                icon: Users,
                title: "Aktivna Zajednica",
                desc: "Budi dio vibrantne zajednice studenata, alumni i profesionalaca"
              },
              {
                icon: Briefcase,
                title: "Prosti Alati",
                desc: "Intuitivni interfejs koji olakšava pronalaženje posla ili kandidata"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition">
                <feature.icon className="w-12 h-12 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-950 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= OSTALI OGLASI ============= */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-950 mb-4">Nedavno Objavljeni Oglasi</h2>
            <p className="text-slate-600 text-lg">Pronađi pravu poziciju za sebe</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: "Junior React Developer",
                company: "Tech Solutions",
                location: "Beograd",
                type: "Full-time",
                salary: "1200€"
              },
              {
                title: "Backend Developer (Node.js)",
                company: "StartUp Innovation",
                location: "Novi Sad",
                type: "Remote",
                salary: "1400€"
              },
              {
                title: "UI/UX Designer",
                company: "Creative Agency",
                location: "Beograd",
                type: "Part-time",
                salary: "900€"
              }
            ].map((job, idx) => (
              <Link
                key={idx}
                to="/jobs"
                className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-emerald-400 hover:shadow-lg transition group"
              >
                <h3 className="text-xl font-bold text-slate-950 mb-2 group-hover:text-emerald-400 transition">
                  {job.title}
                </h3>
                <p className="text-slate-600 mb-4">{job.company}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-slate-100 text-slate-700 rounded-full px-3 py-1">{job.location}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 rounded-full px-3 py-1">{job.type}</span>
                </div>
                <p className="text-emerald-600 font-bold">{job.salary}</p>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 transition"
            >
              Vidi Sve Oglase
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============= CTA SEKCIJA ============= */}
      <section className="py-20 px-6 bg-gradient-to-r from-emerald-500 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Spreman da Počneš?</h2>
          <p className="text-lg mb-8 opacity-95">
            Bez obzira da li tražiš svoju prvu praksu ili postavljaš poziciju, Jobzee je pravo mjesto za tebe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="px-8 py-4 rounded-full bg-white text-emerald-600 font-bold text-lg hover:bg-slate-100 transition"
            >
              Počni Pretragu
            </Link>
            <Link
              to="/"
              className="px-8 py-4 rounded-full border-2 border-white text-white font-bold text-lg hover:bg-white/20 transition"
            >
              Kreiraj Nalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
