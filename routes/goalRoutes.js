const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { listGoals, addGoal, editGoal, removeGoal } = require('../controllers/goalController');

router.use(auth);
router.get('/', listGoals);
router.post('/', addGoal);
router.put('/:id', editGoal);
router.delete('/:id', removeGoal);

module.exports = router;
