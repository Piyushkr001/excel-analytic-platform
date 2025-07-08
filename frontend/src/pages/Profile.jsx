import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

/* 1. Global config */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const STATIC    = import.meta.env.VITE_STATIC_URL || 'http://localhost:8000'; // for /uploads

/* 2. Memoised Axios */
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
  const [user, setUser]   = useState({ name: '', email: '', role: '', image: '' });
  const [password, setPw] = useState('');
  const [imageFile, setImgFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);

  const token = localStorage.getItem('token');
  const api   = useApi(token);

  /* 3. Fetch profile */
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

  /* 4. Save handler */
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name',  user.name);
      formData.append('email', user.email);
      if (password)  formData.append('password', password);
      if (imageFile) formData.append('image', imageFile);
      else if (user.image) formData.append('existingImage', user.image); // 👈 keep old one

      const { data } = await api.put('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(data);
      setPw('');
      setImgFile(null);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  }, [api, user, password, imageFile]);

  /* 5. Derived preview URL */
  const previewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : user.image
      ? `${STATIC}${user.image}`   // e.g. http://localhost:8000/uploads/xyz.jpg
      : '/default-avatar.png';

  /* 6. Loading state */
  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  /* 7. UI */
  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-xl mt-8 space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <img
          src={previewUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover mb-2 ring-2 ring-blue-500/30"
        />
        <label className="cursor-pointer text-sm text-blue-600 hover:underline">
          Change photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImgFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>

      {/* Summary */}
      <div className="text-left space-y-1">
        <h2 className="text-xl font-bold text-blue-600">Your Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {/* Form */}
      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-semibold">Edit details</h3>

        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Name"
          value={user.name}
          disabled={saving}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          type="email"
          value={user.email}
          disabled={saving}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="New password (optional)"
          type="password"
          value={password}
          disabled={saving}
          onChange={(e) => setPw(e.target.value)}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
