import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SignupSuccess from './pages/SignupSuccess.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NavBar from './components/NavBar.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './components/ToastProvider.jsx';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen relative text-slate-100">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 bg-grid" />
          <div className="pointer-events-none absolute -z-10 inset-0">
            <div className="absolute w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full top-10 left-10" />
            <div className="absolute w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full bottom-10 right-10" />
          </div>

          <NavBar />
          <div className="max-w-5xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signup-success" element={<SignupSuccess />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
