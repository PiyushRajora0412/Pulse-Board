const db = require('../db/database');

function createGoal(userId, title, target) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO goals (user_id, title, target) VALUES (?, ?, ?)';
    db.run(sql, [userId, title, target], function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, user_id: userId, title, target, progress: 0 });
    });
  });
}

function getGoalsByUser(userId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM goals WHERE user_id = ? ORDER BY id DESC';
    db.all(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

function updateGoal(id, userId, { title, target, progress }) {
  return new Promise((resolve, reject) => {
    
    const fields = [];
    const values = [];
    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (target !== undefined) { fields.push('target = ?'); values.push(target); }
    if (progress !== undefined) { fields.push('progress = ?'); values.push(progress); }
    if (fields.length === 0) return resolve(null);

    const sql = `UPDATE goals SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    values.push(id, userId);

    db.run(sql, values, function (err) {
      if (err) return reject(err);
      if (this.changes === 0) return resolve(null);
      
      db.get('SELECT * FROM goals WHERE id = ? AND user_id = ?', [id, userId], (err2, row) => {
        if (err2) return reject(err2);
        resolve(row || null);
      });
    });
  });
}

function deleteGoal(id, userId) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM goals WHERE id = ? AND user_id = ?';
    db.run(sql, [id, userId], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
}

module.exports = { createGoal, getGoalsByUser, updateGoal, deleteGoal };
