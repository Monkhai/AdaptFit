const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/auth');

// Route for user registration
router.post('/register', userController.registerUser);
router.get('/me', auth, userController.getSelf);
router.post('/authenticate', userController.authenticateUser);
router.delete('/delete', auth, userController.deleteUser);
router.put('/update-username', auth, userController.updateUsername);
router.put('/update-email', auth, userController.updateEmail);
router.put('/update-password', auth, userController.updatePassword);

module.exports = router;
