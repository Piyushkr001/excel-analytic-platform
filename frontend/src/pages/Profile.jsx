import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowRightCircle, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const STATIC = import.meta.env.VITE_STATIC_URL || 'http://localhost:8000';

const useApi = (token) =>
  useMemo(() => {
    const instance = axios.create({ baseURL: API_BASE });
    instance.interceptors.request.use((cfg) => {
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
      return cfg;
    });
    return instance;
  }, [token]);

export default function Profile() {
  const [user, setUser] = useState({ name: '', email: '', role: '', image: '' });
  const [password, setPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('token');
  const api = useApi(token);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/user/profile', { signal: controller.signal });
        setUser(data);
      } catch (err) {
        if (!axios.isCancel(err)) toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [api]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      if (password) formData.append('password', password);
      if (imageFile) formData.append('image', imageFile);
      else if (user.image) formData.append('existingImage', user.image);

      const { data } = await api.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(data);
      setPassword('');
      setImageFile(null);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  }, [api, user, password, imageFile]);

  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : user.image
    ? `${STATIC}${user.image}`
    : '/default-avatar.png';

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 mt-10 bg-gradient-to-br from-white to-slate-100 rounded-2xl shadow-2xl border border-gray-100 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Your Profile
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm bg-blue-100 flex items-center gap-3 text-blue-700 px-4 py-1.5 rounded-md border border-blue-200 hover:bg-blue-200 transition"
        >
            Go to Dashboard <ArrowRightCircle className='w-5 h-5'/>
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <img
          src={previewUrl}
          alt="Avatar"
          className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-300 shadow-md transition-all duration-300 hover:scale-105"
        />
        <label className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">
          Change photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      {/* Info Summary */}
      <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium text-gray-900">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-900">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-medium text-gray-900">{user.role}</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Edit Profile</h2>

        <input
          className="w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Name"
          value={user.name}
          disabled={saving}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          className="w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          type="email"
          value={user.email}
          disabled={saving}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          className="w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="New password (optional)"
          type="password"
          value={password}
          disabled={saving}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-md shadow-lg hover:from-blue-700 hover:to-purple-700 transition flex items-center justify-center"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
