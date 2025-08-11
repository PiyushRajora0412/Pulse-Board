import { useState } from 'react';

export default function GoalCard({ goal, onUpdate, onDelete }) {
  const { id, title, target, progress = 0 } = goal;
  const [confirming, setConfirming] = useState(false);
  const pct = Math.min(100, Math.round((progress / Math.max(1, target)) * 100));

  function inc() {
    onUpdate(id, { progress: Math.min(target, (progress || 0) + 1) });
  }
  function dec() {
    onUpdate(id, { progress: Math.max(0, (progress || 0) - 1) });
  }

  return (
    <div className="card p-4 transition hover:-translate-y-0.5 hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold tracking-tight">{title}</h3>
          <p className="text-sm text-slate-400 mt-0.5">Target: {target} • Progress: {progress}</p>
        </div>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-xs px-2 py-1 rounded border border-red-400/30 text-red-300 hover:bg-red-500/10 transition"
          >
            Delete
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(id)}
              className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-500 transition"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs px-2 py-1 rounded border border-slate-600 text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="w-full h-2 rounded bg-slate-800 overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-indigo-500 to-cyan-400"
            style={{ width: `${pct}%`, transition: 'width 400ms ease' }}
          />
        </div>
        <div className="mt-2 text-xs text-slate-400">{pct}%</div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={dec}
          className="text-sm px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
        >
          -1
        </button>
        <button
          onClick={inc}
          className="text-sm px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
        >
          +1
        </button>
      </div>
    </div>
  );
}
