import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, ExternalLink } from 'lucide-react';


const companies = [
  {
    id: 1,
    name: "Yettel d.o.o Beograd",
    logo: "./yettel.png",
    rating: 0,
    reviews: 0,
    salaries: 0,
    tech: ["java", "hibernate", "rest", "git", "linux", "jenkins"],
    benefits: ["Education, professional development", "Hybrid work model", "Family and parenthood"]
  },
  {
    id: 2,
    name: "A1 Srbija d.o.o",
    logo: "./A1_Logo_Red.jpg",
    rating: 0,
    reviews: 0,
    salaries: 0,
    tech: ["java", ".net", "sql", "azure", "angular"],
    benefits: ["Private health insurance", "Gym membership", "Flexible hours"]
  },
  {
    id: 3,
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png",
    rating: 0,
    reviews: 0,
    salaries: 0,
    tech: ["c++", "c#", "azure", "typescript", "react"],
    benefits: ["Stock options", "Paid sabbatical", "On-site gym"]
  },
  {
    id: 4,
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    rating: 0,
    reviews: 0,
    salaries: 0,
    tech: ["python", "go", "tensorflow", "kubernetes", "java"],
    benefits: ["Free gourmet meals", "20% project time", "Extensive health plan"]
  },
  {
    id: 5,
    name: "databricks",
    logo: "./databricks.png",
    rating: 0,
    reviews: 0,
    salaries: 0,
    tech: ["unity", "python", "aws", "react"],
    benefits: ["Unlimited vacation", "Personal travel budget", "Game room"]
  }
];

const CompanySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === companies.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? companies.length - 1 : prev - 1));
  };

  const current = companies[currentIndex];

  return (
    <div className="bg-slate-50 py-16 px-4">
      <div className='text-center mb-12'>
         <h1 className='text-4xl font-extrabold text-slate-800 tracking-tight'>
            Istaknute kompanije
         </h1>
         <div className='h-1 w-20 bg-emerald-400 mx-auto mt-4 rounded-full'></div>
      </div>

      <div className="max-w-6xl mx-auto relative flex items-center justify-center">
        <button 
          onClick={prevSlide}
          className="absolute left-[-20px] md:left-0 z-10 bg-emerald-400 p-3 rounded-full text-white hover:bg-emerald-500 transition-all shadow-lg hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={28} />
        </button>
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-4xl flex flex-col md:flex-row gap-12 min-h-[500px] border border-slate-100">
          <div className="flex flex-col items-center justify-center md:w-1/3 md:border-r border-slate-100 md:pr-12">
            <div className="h-32 w-full flex items-center justify-center mb-6">
                <img src={current.logo} alt={current.name} className="max-h-full max-w-full object-contain" />
            </div>
            
            <div className="flex items-center gap-1 text-slate-700 mb-2">
              <span className="font-extrabold text-2xl">{current.rating}</span>
              <span className="text-yellow-400 text-xl"></span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">{current.name}</h2>
            
            <div className="flex flex-col gap-3 w-full">
              <button className="w-full border-2 border-emerald-400 text-emerald-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all">
                Zaprati kompaniju <Heart size={20} />
              </button>
              <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                Otvori profil <ExternalLink size={20} />
              </button>
            </div>
          </div>
          <div className="md:w-2/3 flex flex-col justify-center">
            <div className="flex gap-8 mb-10 text-base font-bold text-slate-400 uppercase tracking-widest">
              <span>{current.reviews} iskustvo</span>
              <span>{current.salaries} plate</span>
            </div>

            <div className="mb-10">
              <h3 className="font-black text-slate-800 mb-4 text-lg uppercase tracking-tight">Tehnologije</h3>
              <div className="flex flex-wrap gap-2">
                {current.tech.map((t) => (
                  <span key={t} className="bg-slate-100 text-slate-500 px-5 py-2 rounded-full text-sm font-semibold border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black text-slate-800 mb-4 text-lg uppercase tracking-tight">Beneficije</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {current.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-slate-600 font-medium">
                    <span className="text-emerald-500 bg-emerald-50 rounded-full p-1 mt-0.5"></span> 
                    <span className="text-sm">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <button 
          onClick={nextSlide}
          className="absolute right-[-20px] md:right-0 z-10 bg-emerald-400 p-3 rounded-full text-white hover:bg-emerald-500 transition-all shadow-lg hover:scale-110 active:scale-95"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <div className="flex justify-center flex-wrap gap-4 mt-16 max-w-4xl mx-auto px-4">
        {companies.map((comp, index) => (
          <button 
            key={comp.id}
            onClick={() => setCurrentIndex(index)}
            className={`p-4 bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 flex items-center justify-center w-24 h-16 ${
              currentIndex === index 
              ? 'border-emerald-500 scale-110 shadow-md ring-4 ring-emerald-50' 
              : 'border-transparent opacity-40 hover:opacity-100'
            }`}
          >
            <img src={comp.logo} alt="mini-logo" className="max-h-full max-w-full object-contain grayscale-[0.5]" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CompanySlider;