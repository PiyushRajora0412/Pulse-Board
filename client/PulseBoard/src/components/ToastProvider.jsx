import { createContext, useContext, useCallback, useState } from 'react';

const ToastContext = createContext(null);

let idSeq = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    const id = idSeq++;
    const toast = { id, type: t.type || 'info', title: t.title, message: t.message, timeout: t.timeout ?? 2500 };
    setToasts((list) => [...list, toast]);
    setTimeout(() => {
      setToasts((list) => list.filter((x) => x.id !== id));
    }, toast.timeout);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((list) => list.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 grid gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="card px-4 py-3 min-w-[260px] border-slate-700/80 bg-slate-900/90"
          >
            <div className="flex items-start gap-3">
              <span className={
                t.type === 'success' ? 'text-emerald-400' :
                t.type === 'error' ? 'text-red-400' :
                t.type === 'warning' ? 'text-amber-300' :
                'text-indigo-300'
              }>
                {t.type === 'success' ? '✔' : t.type === 'error' ? '✕' : t.type === 'warning' ? '!' : '•'}
              </span>
              <div className="flex-1">
                {t.title && <div className="font-medium">{t.title}</div>}
                {t.message && <div className="text-sm text-slate-300">{t.message}</div>}
              </div>
              <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-200">×</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
