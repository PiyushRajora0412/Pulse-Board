import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import Skeleton from '../components/Skeleton';

export default function Profile() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setErr('');
      setLoading(true);
      try {
        const { user } = await api.me();
        if (mounted) setMe(user);
      } catch (e) {
        if (mounted) setErr(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-slate-400">Your account details and session info.</p>
      </header>

      <div className="card p-5">
        {loading ? (
          <div className="grid gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        ) : err ? (
          <div className="text-red-400 text-sm">{err}</div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 grid place-items-center text-lg">
              {me?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <div className="text-slate-200 font-medium">{me?.email || 'Unknown user'}</div>
              <div className="text-slate-400 text-sm mt-1">
                ID: <span className="text-slate-300">{me?.id || '-'}</span>
              </div>
              <div className="text-slate-400 text-sm">
                Status: <span className="text-emerald-400">Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
