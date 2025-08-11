import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearToken, getToken } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const token = getToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  function logout() {
    clearToken();
    navigate('/login');
  }

  const onAuthPage = ['/login', '/register', '/signup-success'].includes(location.pathname);
  const initials = user?.email ? user.email[0]?.toUpperCase() : 'P';

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={token ? '/dashboard' : '/login'} className="font-semibold tracking-wide">
          <span className="brand-glow bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-300 text-2xl md:text-3xl">
            PulseBoard
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {!token && !onAuthPage && (
            <>
              <Link className="text-sm md:text-base text-slate-300 hover:text-white transition" to="/login">Login</Link>
              <Link className="text-sm md:text-base text-slate-300 hover:text-white transition" to="/register">Register</Link>
            </>
          )}

          {token && (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm md:text-base text-slate-200 hover:text-white transition"
                title="Profile"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700">
                  {initials}
                </span>
                <span className="hidden sm:block">{user?.email || 'Profile'}</span>
              </Link>
              <button
                onClick={logout}
                className="text-sm md:text-base px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
