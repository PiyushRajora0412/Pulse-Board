import { useEffect, useState } from 'react';
import { api, sleep } from '../utils/api';
import GoalForm from '../components/GoalForm.jsx';
import GoalCard from '../components/GoalCard.jsx';
import Skeleton from '../components/Skeleton.jsx';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

function GoalSkeleton() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-2 w-full mt-3" />
      <Skeleton className="h-3 w-10 mt-2" />
      <div className="flex gap-2 mt-3">
        <Skeleton className="h-9 w-14" />
        <Skeleton className="h-9 w-14" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const name = user?.email ? user.email.split('@')[0] : 'There';

  async function load() {
    setErr('');
    setLoading(true);
    try {
      const [{ goals }] = await Promise.all([api.getGoals(), sleep(500)]);
      setGoals(goals);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addGoal(title, target) {
    try {
      const { goal } = await api.addGoal(title, target);
      setGoals((g) => [goal, ...g]);
      addToast({ type: 'success', title: 'Goal added', message: `“${title}” created.` });
    } catch (e) {
      setErr(e.message);
      addToast({ type: 'error', title: 'Failed to add goal', message: e.message });
    }
  }

  async function updateGoal(id, payload) {
    try {
      const { goal } = await api.updateGoal(id, payload);
      setGoals((g) => g.map((x) => (x.id === id ? goal : x)));
    } catch (e) {
      setErr(e.message);
      addToast({ type: 'error', title: 'Update failed', message: e.message });
    }
  }

  async function deleteGoal(id) {
    try {
      await api.deleteGoal(id);
      setGoals((g) => g.filter((x) => x.id !== id));
      addToast({ type: 'success', title: 'Goal deleted' });
    } catch (e) {
      setErr(e.message);
      addToast({ type: 'error', title: 'Delete failed', message: e.message });
    }
  }

  return (
    <div className="grid gap-6">
      <header className="transition">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100">
          Dashboard
        </h1>
        <p className="text-slate-400 mt-1">
          Welcome back, <span className="text-slate-200">{name}</span>. Track goals. Make visible progress.
        </p>
      </header>

      <GoalForm onCreate={addGoal} />

      {err && <div className="text-sm text-red-400">{err}</div>}

      {loading ? (
        <div className="grid gap-4">
          <GoalSkeleton />
          <GoalSkeleton />
          <GoalSkeleton />
        </div>
      ) : goals.length === 0 ? (
        <div className="text-slate-300 card p-6 text-center">
          <div className="text-lg mb-1">No goals yet</div>
          <div className="text-slate-400">Create your first goal above and watch the progress bar grow.</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
          ))}
        </div>
      )}
    </div>
  );
}
