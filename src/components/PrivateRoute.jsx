import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

/**
 * Privatna ruta - sprečava pristup ako korisnik nije prijavljen ili nema dozvoljene uloge
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Komponenta koja se prikazuje ako je pristup dozvoljen
 * @param {String[]} props.allowedRoles - Dozvoljene uloge (npr. ['company', 'alumni'])
 * @returns {JSX.Element}
 */
export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Čekaj da se auth učita
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Učitavanje...</p>
        </div>
      </div>
    );
  }

  // Ako korisnik nije prijavljen, prikaži AuthModal
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Prijava Obavezna</h2>
            <p className="text-slate-600 mb-8">Moraš biti prijavljen da pristupiš ovoj stranici</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 rounded-full bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-500 transition"
            >
              Prijavi Se / Registruj
            </button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  // Ako su specificisane dozvoljene uloge, provjeri da li korisnik ima jednu od njih
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Pristup Odbijen</h2>
          <p className="text-slate-600">Nemaš dozvolu da pristupiš ovoj stranici</p>
        </div>
      </div>
    );
  }

  // Svi uslovi su ispunjeni - prikaži komponentu
  return children;
}
