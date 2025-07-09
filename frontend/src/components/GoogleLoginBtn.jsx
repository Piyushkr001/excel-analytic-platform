/* eslint-disable react-hooks/exhaustive-deps */
/* global google */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const API       = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) return resolve();
    if (document.getElementById('gsi')) return resolve();

    const s = document.createElement('script');
    s.id = 'gsi';
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = s.defer = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Google script failed'));
    document.head.appendChild(s);
  });
}

/** Props: { role: 'user' | 'admin' } */
export default function GoogleLoginBtn({ role }) {
  const btnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        if (!CLIENT_ID) return console.warn('VITE_GOOGLE_CLIENT_ID missing');
        await loadGoogleScript();

        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async ({ credential }) => {
            if (!credential) return toast.error('No Google credential');

            try {
              const { data } = await axios.post(`${API}/auth/google`, {
                credential,
                role,
              });

              localStorage.setItem('token', data.token);
              const { role: realRole } = jwtDecode(data.token);

              if (realRole !== role) {
                localStorage.removeItem('token');
                return toast.error(`Access denied: you are "${realRole}"`);
              }

              toast.success('Logged in with Google');
              navigate(realRole === 'admin' ? '/dashboard/admin' : '/dashboard');
            } catch (err) {
              toast.error(err.response?.data?.error || 'Google sign-in failed');
            }
          },
        });

        google.accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [role]);

  return <div ref={btnRef} className="flex justify-center my-4" />;
}
