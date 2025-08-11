import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const id = setTimeout(() => navigate('/login', { replace: true }), 1500);
    return () => clearTimeout(id);
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-24 text-center">
      <div className="card p-10">
        <div className="mx-auto w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <svg viewBox="0 0 52 52" className="w-16 h-16">
            <circle cx="26" cy="26" r="25" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="2" />
            <path
              d="M14 27 L22 34 L38 18"
              fill="none"
              stroke="#34d399"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: 'draw 700ms ease forwards' }}
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Signup complete</h2>
        <p className="text-slate-400 mt-1">Redirecting you to login...</p>
        <button
          onClick={() => navigate('/login', { replace: true })}
          className="mt-6 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
