import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Briefcase, FileText, UserCircle, LogOut, Settings } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [key, setKey] = useState(0);
    const { user, logout, isAuthenticated, isCompany } = useAuth();

    // Re-render kada se user promeni
    useEffect(() => {
        setKey(prev => prev + 1);
    }, [user]);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="w-full sticky top-0 z-40 backdrop-blur bg-white/90 border-b border-slate-200">
                <div className="flex justify-between items-center h-20 max-w-[1240px] mx-auto px-4 text-slate-900">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl font-display font-bold tracking-tight">Jobzee</span>
                        <span className="text-xs uppercase tracking-widest text-emerald-600">careers</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
                        <Link to="/" className="hover:text-emerald-600 transition-colors">Početna</Link>
                        <Link to="/blog" className="hover:text-emerald-600 transition-colors">Blog</Link>
                    </nav>

                    {/* Hamburger button - visible only on mobile */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-200 transition"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated() ? (
                            <>
                                <Link
                                    to="/jobs"
                                    className="hidden sm:inline-flex px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-slate-500 transition"
                                >
                                    Pretrazi oglase
                                </Link>
                                
                                {(user?.role === 'student' || user?.role === 'alumni') && (
                                    <Link
                                        to="/my-applications"
                                        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 transition"
                                    >
                                        <FileText size={16} />
                                        Aplikacije
                                    </Link>
                                )}
                                
                                {isCompany() && (
                                    <>
                                        <Link
                                            to="/applications"
                                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 transition"
                                        >
                                            <FileText size={16} />
                                            Aplikacije
                                        </Link>
                                        <Link
                                            to="/my-jobs"
                                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 transition"
                                        >
                                            <Briefcase size={16} />
                                            Moji oglasi
                                        </Link>
                                        <Link
                                            to="/create-job"
                                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition shadow-sm"
                                        >
                                            Postavi oglas
                                        </Link>
                                    </>
                                )}
                                
                                {user?.role === 'alumni' && (
                                    <>
                                        <Link
                                            to="/my-jobs"
                                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 transition"
                                        >
                                            <Briefcase size={16} />
                                            Moji oglasi
                                        </Link>
                                        <Link
                                            to="/create-job"
                                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition shadow-sm"
                                        >
                                            Postavi oglas
                                        </Link>
                                    </>
                                )}

                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin-console"
                                        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition text-xs shadow-sm"
                                    >
                                        <Settings size={16} />
                                        Admin
                                    </Link>
                                )}

                                <Link
                                    to="/profile"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-900 font-semibold hover:bg-slate-300 transition"
                                >
                                    <UserCircle size={16} />
                                    {user?.firstName || 'Profil'}
                                </Link>
                                
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
                                >
                                    <LogOut size={16} />
                                    Odjava
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/jobs"
                                    className="hidden sm:inline-flex px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:border-slate-500 transition"
                                >
                                    Pretrazi oglase
                                </Link>
                                <button
                                    onClick={() => setAuthModalOpen(true)}
                                    className="hidden sm:inline-flex px-4 py-2 rounded-full bg-emerald-400 text-slate-900 font-semibold hover:bg-emerald-300 transition"
                                >
                                    Postavi oglas
                                </button>
                                <button
                                    onClick={() => setAuthModalOpen(true)}
                                    className="px-4 py-2 rounded-full bg-slate-950 text-white font-semibold hover:bg-slate-800 transition"
                                >
                                    Prijava / Registracija
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
                        <div className="max-w-[1240px] mx-auto px-4 py-6 space-y-3">
                            {isAuthenticated() ? (
                                <>
                                    <Link
                                        to="/"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                    >
                                        Početna
                                    </Link>
                                    <Link
                                        to="/blog"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                    >
                                        Blog
                                    </Link>
                                    <Link
                                        to="/jobs"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                    >
                                        Pretraži oglase
                                    </Link>

                                    {(user?.role === 'student' || user?.role === 'alumni') && (
                                        <Link
                                            to="/my-applications"
                                            onClick={closeMobileMenu}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                        >
                                            <FileText size={18} />
                                            Moje aplikacije
                                        </Link>
                                    )}

                                    {isCompany() && (
                                        <>
                                            <Link
                                                to="/applications"
                                                onClick={closeMobileMenu}
                                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                            >
                                                <FileText size={18} />
                                                Pregled aplikacija
                                            </Link>
                                            <Link
                                                to="/my-jobs"
                                                onClick={closeMobileMenu}
                                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                            >
                                                <Briefcase size={18} />
                                                Moji oglasi
                                            </Link>
                                            <Link
                                                to="/create-job"
                                                onClick={closeMobileMenu}
                                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-emerald-400 text-slate-900 hover:bg-emerald-300 transition text-center font-bold"
                                            >
                                                Postavi oglas
                                            </Link>
                                        </>
                                    )}

                                    {user?.role === 'alumni' && (
                                        <>
                                            <Link
                                                to="/my-jobs"
                                                onClick={closeMobileMenu}
                                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                            >
                                                <Briefcase size={18} />
                                                Moji oglasi
                                            </Link>
                                            <Link
                                                to="/create-job"
                                                onClick={closeMobileMenu}
                                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-emerald-400 text-slate-900 hover:bg-emerald-300 transition text-center font-bold"
                                            >
                                                Postavi oglas
                                            </Link>
                                        </>
                                    )}

                                    {user?.role === 'admin' && (
                                        <Link
                                            to="/admin-console"
                                            onClick={closeMobileMenu}
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-center font-bold"
                                        >
                                            <Settings size={18} />
                                            Admin Console
                                        </Link>
                                    )}

                                    <Link
                                        to="/profile"
                                        onClick={closeMobileMenu}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-slate-200 text-slate-900 hover:bg-slate-300 transition text-center font-semibold"
                                    >
                                        <UserCircle size={18} />
                                        {user?.firstName || 'Profil'}
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-center font-semibold"
                                    >
                                        <LogOut size={18} />
                                        Odjava
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                    >
                                        Početna
                                    </Link>
                                    <Link
                                        to="/blog"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                    >
                                        Blog
                                    </Link>
                                    <Link
                                        to="/jobs"
                                        onClick={closeMobileMenu}
                                        className="block w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition text-center font-semibold"
                                    >
                                        Pretraži oglase
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setAuthModalOpen(true);
                                            closeMobileMenu();
                                        }}
                                        className="block w-full px-4 py-3 rounded-lg bg-emerald-400 text-slate-900 hover:bg-emerald-300 transition text-center font-bold"
                                    >
                                        Postavi oglas
                                    </button>
                                    <button
                                        onClick={() => {
                                            setAuthModalOpen(true);
                                            closeMobileMenu();
                                        }}
                                        className="block w-full px-4 py-3 rounded-lg bg-slate-950 text-white hover:bg-slate-800 transition text-center font-bold"
                                    >
                                        Prijava / Registracija
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
};

export default Navbar;