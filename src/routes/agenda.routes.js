
const express = require('express');
const AgendaController = require('../controllers/AgendaController');
const authMiddleware = require('../middleware/auth');

const routes = express.Router();

routes.use(authMiddleware); 

routes.get('/', AgendaController.index);  // Listar agendas
routes.post('/', AgendaController.create);  // Criar agenda
routes.put('/:id', AgendaController.update);  // Atualizar agenda
routes.delete('/:id', AgendaController.delete);  // Deletar agenda

module.exports = routes;
