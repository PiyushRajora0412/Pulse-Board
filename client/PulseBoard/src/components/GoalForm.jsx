import { useState } from 'react';
import Spinner from './Spinner';

export default function GoalForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!title || !target) return;
    setLoading(true);
    try {
      await onCreate(title.trim(), Number(target));
      setTitle('');
      setTarget('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card p-4 transition hover:border-slate-700">
      <div className="grid gap-3">
        <div className="grid gap-1">
          <label className="text-sm text-slate-300">Title</label>
          <input
            className="px-3 py-2 rounded bg-slate-800/70 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/60 transition"
            placeholder="Read books"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm text-slate-300">Target (number)</label>
          <input
            type="number"
            min="1"
            className="px-3 py-2 rounded bg-slate-800/70 border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/60 transition"
            placeholder="10"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="justify-self-start px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-60 inline-flex items-center gap-2 transition"
        >
          {loading && <Spinner size={16} />}
          {loading ? 'Adding...' : 'Add Goal'}
        </button>
      </div>
    </form>
  );
}
