import { useState } from 'react';
import { api, setToken, sleep } from '../utils/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const { refresh } = useAuth();
  const { addToast } = useToast();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const [res] = await Promise.all([
        api.login(email.trim(), password),
        sleep(800),
      ]);
      setToken(res.token);
      await refresh();
      addToast({ type: 'success', title: 'Welcome back', message: 'You are now signed in.' });
      navigate(from, { replace: true });
    } catch (e) {
      setErr(e.message);
      addToast({ type: 'error', title: 'Login failed', message: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-semibold mb-6">Welcome back</h1>
      <form onSubmit={submit} className="card p-4 transition hover:border-slate-700">
        {err && <div className="text-sm text-red-400 mb-2">{err}</div>}
        <input
          className="px-3 py-2 rounded bg-slate-800/70 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/60 transition mb-2"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="px-3 py-2 rounded bg-slate-800/70 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/60 transition mb-3"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          disabled={loading}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60 inline-flex items-center gap-2"
        >
          {loading && <Spinner />}
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <div className="text-sm text-slate-400 mt-3">
          No account? <Link to="/register" className="text-indigo-400 hover:underline">Register</Link>
        </div>
      </form>
    </div>
  );
}
