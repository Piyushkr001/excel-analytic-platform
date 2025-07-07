import { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    try {
      setLoading(true);
      await axios.post('http://localhost:8000/api/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent if email exists!');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">Forgot Password</h2>

        {sent ? (
          <p className="text-green-600 text-sm text-center">
            If the email exists, a reset link has been sent.
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold flex justify-center items-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Sending…
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
