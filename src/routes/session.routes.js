const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

const routes = express.Router();

routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.get('/profile', authMiddleware, UserController.profile);

module.exports = routes;
