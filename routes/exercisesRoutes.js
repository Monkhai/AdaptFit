const express = require('express');
const exercisesController = require('../controllers/exercisesController');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', auth, exercisesController.createExercise);
router.get('/', auth, exercisesController.getExercises);
router.get('/exercise', auth, exercisesController.getOneExercise);
router.delete('/delete', auth, exercisesController.deleteExercise);
router.put('/update', auth, exercisesController.updateExercise);

module.exports = router;
