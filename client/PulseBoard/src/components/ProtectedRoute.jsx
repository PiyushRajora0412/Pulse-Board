import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, getToken, clearToken, sleep } from '../utils/api';
import Spinner from './Spinner';

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [ok, setOk] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    async function verify() {
      const token = getToken();
      if (!token) {
        if (mounted) { setOk(false); setChecking(false); }
        return;
      }
      try {
        await Promise.all([api.me(), sleep(350)]);
        if (mounted) setOk(true);
      } catch {
        clearToken();
        if (mounted) setOk(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }
    verify();
    return () => { mounted = false; };
  }, []);

  if (checking) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="card px-6 py-5 inline-flex items-center gap-3">
          <Spinner size={20} />
          <span className="text-sm text-slate-300">Checking session…</span>
        </div>
      </div>
    );
  }

  if (!ok) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
