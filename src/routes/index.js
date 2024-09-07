const express = require('express');
const UserController = require('../controllers/UserController');
const AgendaController = require('../controllers/AgendaController');
const authMiddleware = require('../middleware/auth');

const routes = express.Router();

// Rotas de usuário
routes.post('/register', UserController.register);
routes.post('/login', UserController.login);
routes.get('/profile', authMiddleware, UserController.profile);

// Rotas de agendas
routes.get('/agendas', authMiddleware, AgendaController.index);
routes.post('/agendas', authMiddleware, AgendaController.create);
routes.put('/agendas/:id', authMiddleware, AgendaController.update);
routes.delete('/agendas/:id', authMiddleware, AgendaController.delete);

module.exports = routes;
