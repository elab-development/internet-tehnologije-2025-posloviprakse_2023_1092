import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register, user } = useAuth();

  // Automatski zatvori modal nakon uspešnog login-a
  useEffect(() => {
    if (user && isOpen) {
      // Korisnik je prijavljen - zatvori modal
      setTimeout(() => {
        onClose();
        setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
        setError('');
        setSuccess('');
      }, 500);
    }
  }, [user, isOpen]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const roles = [
    { id: 'student', label: 'Student', description: 'Tražim posao/praksu' },
    { id: 'alumni', label: 'Alumni', description: 'Završio sam studije' },
    { id: 'company', label: 'Kompanija', description: 'Tražim radnike' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validacija
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Ime i prezime su obavezni');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email je obavezan');
      return;
    }
    if (formData.password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Lozinke se ne podudaraju');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: selectedRole
      });

      if (!result.success) {
        setError(result.error || 'Greška pri registraciji');
        return;
      }

      setSuccess(' Registracija uspešna! Prijavljen si kao ' + selectedRole);
      
    } catch (err) {
      setError('Greška pri konekciji');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email i lozinka su obavezni');
      return;
    }

    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError(result.error || 'Greška pri prijavi');
        return;
      }
      
      setSuccess(' Uspešna prijava!');
      
    } catch (err) {
      setError('Greška pri konekciji');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-950 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-display">
            {isLogin ? 'Prijava' : 'Registracija'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                isLogin
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Prijava
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                !isLogin
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Registracija
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {/* Registration Fields */}
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Ime"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-400"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Prezime"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Role Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Kakav si korisnik?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map(role => (
                      <label
                        key={role.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                          selectedRole === role.id
                            ? 'border-emerald-400 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.id}
                          checked={selectedRole === role.id}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="hidden"
                        />
                        <div className="font-semibold text-slate-900">{role.label}</div>
                        <div className="text-xs text-slate-600">{role.description}</div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:border-emerald-400"
            />

            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Lozinka"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-600 hover:text-slate-900"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Ponovi lozinku"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:border-emerald-400"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Prijava...' : 'Registracija...'}</span>
                </>
              ) : (
                isLogin ? 'Prijava' : 'Registracija'
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 text-sm mt-4">
            {isLogin ? 'Nemaš nalog?' : 'Već imaš nalog?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-emerald-500 font-semibold hover:underline"
            >
              {isLogin ? 'Kreni ovdje' : 'Prijavi se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
