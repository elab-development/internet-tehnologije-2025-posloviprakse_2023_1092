import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Briefcase, Edit2, LogOut, Upload, Download, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI, companiesAPI } from '../services/api';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phone: '',
    location: '',
    skills: '',
    experience: '',
    education: '',
    companyName: '',
    description: '',
    website: '',
    industry: '',
    employees: '',
    companyLocation: ''
  });
  const { user, token, loading: authLoading, logout, isStudent, isCompany, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!token || !user) {
      navigate('/');
      return;
    }

    fetchProfile();
  }, [authLoading, navigate, token, user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (isStudent()) {
        const data = await studentAPI.getProfile();
        setUserProfile(data.data || data);
      } else if (isCompany()) {
        const data = await companiesAPI.getMyProfile();
        setUserProfile(data.data || data);
      } else {
        setUserProfile(user);
      }
    } catch (err) {
      console.error('Greška pri učitavanju profila:', err);
      setError(err.message);
      setUserProfile(user);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openEdit = () => {
    if (isStudent()) {
      const jobSeekerUser = userProfile?.user || user;
      setFormData({
        firstName: jobSeekerUser?.firstName || '',
        lastName: jobSeekerUser?.lastName || '',
        bio: userProfile?.bio || '',
        phone: userProfile?.phone || '',
        location: userProfile?.location || '',
        skills: Array.isArray(userProfile?.skills) ? userProfile.skills.join(', ') : '',
        experience: userProfile?.experience ?? '',
        education: Array.isArray(userProfile?.education) ? userProfile.education.join('\n') : '',
        companyName: '',
        description: '',
        website: '',
        industry: '',
        employees: '',
        companyLocation: ''
      });
    } else if (isCompany()) {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: '',
        phone: '',
        location: '',
        skills: '',
        experience: '',
        education: '',
        companyName: userProfile?.companyName || '',
        description: userProfile?.description || '',
        website: userProfile?.website || '',
        industry: userProfile?.industry || '',
        employees: userProfile?.employees ?? '',
        companyLocation: userProfile?.location || ''
      });
    } else {
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: '',
        phone: '',
        location: '',
        skills: '',
        experience: '',
        education: '',
        companyName: '',
        description: '',
        website: '',
        industry: '',
        employees: '',
        companyLocation: ''
      });
    }

    setProfileImageFile(null);
    setError('');
    setEditOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isStudent()) {
        const payload = {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          bio: formData.bio.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          skills: formData.skills
            ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
            : [],
          experience: formData.experience === '' ? undefined : Number(formData.experience),
          education: formData.education
            ? formData.education.split('\n').map(s => s.trim()).filter(Boolean)
            : []
        };

        const response = await studentAPI.updateProfile(payload);
        setUserProfile(response.data || response);
        if (response?.data?.user) {
          updateUser(response.data.user);
        }

        if (profileImageFile) {
          const uploadResponse = await studentAPI.uploadProfilePicture(profileImageFile);
          updateUser({ profilePicture: uploadResponse.data?.profilePicture });
        }
      } else if (isCompany()) {
        const payload = {
          companyName: formData.companyName.trim(),
          description: formData.description.trim(),
          website: formData.website.trim(),
          industry: formData.industry.trim(),
          location: formData.companyLocation.trim(),
          employees: formData.employees === '' ? undefined : Number(formData.employees)
        };

        const response = await companiesAPI.updateProfile(payload);
        setUserProfile(response.data || response);

        if (profileImageFile) {
          const uploadResponse = await companiesAPI.uploadLogo(profileImageFile);
          setUserProfile(prev => ({ ...prev, logo: uploadResponse.data?.logo || prev?.logo }));
        }
      }

      setEditOpen(false);
    } catch (err) {
      setError(err.message || 'Greška pri čuvanju profila');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-600">Učitavanje profila...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-slate-950 mb-2">Moj Profil</h1>
          <p className="text-slate-600">Pregled i upravljanje tvojim nalogom</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden mb-6">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar & Name */}
            <div className="flex items-end gap-6 -mt-16 mb-8">
              <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-white flex items-center justify-center text-emerald-400 overflow-hidden">
                {(isCompany() ? userProfile?.logo : (userProfile?.user?.profilePicture || user?.profilePicture)) ? (
                  <img
                    src={isCompany() ? userProfile?.logo : (userProfile?.user?.profilePicture || user?.profilePicture)}
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} />
                )}
              </div>
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-slate-950">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-emerald-600 font-semibold capitalize text-lg">
                  {user?.role === 'student' && '👨‍🎓 Student'}
                  {user?.role === 'alumni' && '🎓 Alumni'}
                  {user?.role === 'company' && '🏢 Kompanija'}
                  {user?.role === 'admin' && '⚙️ Administrator'}
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Mail className="text-emerald-500" size={20} />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                  <p className="text-slate-900 font-semibold">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Briefcase className="text-emerald-500" size={20} />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
                  <p className="text-slate-900 font-semibold capitalize">
                    {user?.role === 'student' && 'Student - Traži praksu ili posao'}
                    {user?.role === 'alumni' && 'Alumni - Može objaviti oglase'}
                    {user?.role === 'company' && 'Kompanija - Može objaviti poslove'}
                    {user?.role === 'admin' && 'Administrator'}
                  </p>
                </div>
              </div>

              {(isStudent() ? userProfile?.phone : user?.phone) && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <MapPin className="text-emerald-500" size={20} />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Telefon</p>
                    <p className="text-slate-900 font-semibold">
                      {isStudent() ? userProfile?.phone : user?.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <button
                onClick={openEdit}
                className="flex-1 px-6 py-3 rounded-full bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-500 transition flex items-center justify-center gap-2"
              >
                <Edit2 size={20} />
                Uredi Profil
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 rounded-full border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2"
              >
                <LogOut size={20} />
                Odjava
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        {(user?.role === 'student' || user?.role === 'alumni') && (
          <div className="bg-white rounded-2xl shadow border border-slate-100 p-8">
            <h3 className="text-xl font-bold text-slate-950 mb-4">Dodatne Informacije</h3>
            <div className="space-y-4 text-slate-600">
              <p>Možeš ažurirati bio, veštine, iskustvo i dodati CV.</p>
              <p className="text-sm">Promene se vide odmah nakon čuvanja.</p>
            </div>
          </div>
        )}

        {user?.role === 'company' && (
          <div className="bg-white rounded-2xl shadow border border-slate-100 p-8">
            <h3 className="text-xl font-bold text-slate-950 mb-4">Kompanije Informacije</h3>
            <div className="space-y-4 text-slate-600">
              <p>Uredi detalje kompanije (naziv, industrija, lokacija..) u modalu za izmenu profila.</p>
            </div>
          </div>
        )}
      </div>

      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-950 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-display">Uredi Profil</h2>
              <button
                onClick={() => setEditOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Ime</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Prezime</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  {isCompany() ? 'Logo kompanije' : 'Profilna slika'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                  className="w-full mt-1"
                />
              </div>

              {isStudent() && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Telefon</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Lokacija</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Veštine (odvojene zarezom)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Iskustvo (godina)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Edukacija (po liniji)</label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {isCompany() && (
                <>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">Naziv kompanije</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">Opis</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Industrija</label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Lokacija</label>
                      <input
                        type="text"
                        name="companyLocation"
                        value={formData.companyLocation}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Broj zaposlenih</label>
                      <input
                        type="number"
                        name="employees"
                        value={formData.employees}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full mt-1 px-4 py-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 rounded-full bg-emerald-400 text-slate-950 font-semibold hover:bg-emerald-500 transition disabled:opacity-60"
                >
                  {saving ? 'Čuvanje...' : 'Sačuvaj promene'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="flex-1 px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Otkaži
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
