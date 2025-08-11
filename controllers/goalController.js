const { createGoal, getGoalsByUser, updateGoal, deleteGoal } = require('../models/goalModel');

async function listGoals(req, res, next) {
  try {
    const goals = await getGoalsByUser(req.userId);
    res.json({ goals });
  } catch (err) {
    next(err);
  }
}

async function addGoal(req, res, next) {
  try {
    const { title, target } = req.body || {};
    if (!title || target === undefined) {
      return res.status(400).json({ error: 'title and target are required' });
    }
    const goal = await createGoal(req.userId, title, Number(target));
    res.status(201).json({ goal });
  } catch (err) {
    next(err);
  }
}

async function editGoal(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, target, progress } = req.body || {};
    const updated = await updateGoal(id, req.userId, {
      title,
      target: target !== undefined ? Number(target) : undefined,
      progress: progress !== undefined ? Number(progress) : undefined,
    });
    if (!updated) return res.status(404).json({ error: 'Goal not found' });
    res.json({ goal: updated });
  } catch (err) {
    next(err);
  }
}

async function removeGoal(req, res, next) {
  try {
    const id = Number(req.params.id);
    const ok = await deleteGoal(id, req.userId);
    if (!ok) return res.status(404).json({ error: 'Goal not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { listGoals, addGoal, editGoal, removeGoal };
