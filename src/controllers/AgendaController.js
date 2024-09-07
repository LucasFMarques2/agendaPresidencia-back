const moment = require('moment'); 
const knex = require('../database/knex');
const AppError = require('../utils/AppError');

module.exports = {
  async index(req, res, next) {
    try {
      const { userId } = req;  
      console.log('userId:', userId); 

      const agendas = await knex('agendas').where({ user_id: userId });

      if (!agendas || agendas.length === 0) {
        throw new AppError('Nenhuma agenda encontrada', 404);  
      }

      return res.json(agendas);
    } catch (error) {
      console.error('Erro ao listar agendas:', error);
      next(error);  
    }
  },

  async create(req, res, next) {
    try {
      const { titulo, descricao, dataInicio, dataFim, local } = req.body;
      const { userId } = req;  

      if (!titulo || !dataInicio || !dataFim || !local) {
        throw new AppError('Todos os campos obrigatórios devem ser preenchidos', 400);  
      }

      if (moment(dataInicio).isAfter(moment(dataFim))) {
        throw new AppError('A data de início não pode ser maior que a data de fim', 400);  
      }

      const [agenda] = await knex('agendas').insert({
        titulo,
        descricao,
        dataInicio,
        dataFim,
        local,
        user_id: userId,  
        estadoAtual: 'agendado',
      }).returning('*');

      return res.status(201).json(agenda);
    } catch (error) {
      console.error('Erro ao criar agenda:', error);
      next(error);  
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;  
      const { titulo, descricao, dataInicio, dataFim, local, estadoAtual } = req.body;
      const { userId } = req;  

      const agenda = await knex('agendas').where({ id, user_id: userId }).first();

      if (!agenda) {
        throw new AppError('Agenda não encontrada', 404);  
      }

      if (moment(dataInicio).isAfter(moment(dataFim))) {
        throw new AppError('A data de início não pode ser maior que a data de fim', 400);  
      }

      const [updatedAgenda] = await knex('agendas')
        .where({ id, user_id: userId })  
        .update({
          titulo,
          descricao,
          dataInicio,
          dataFim,
          local,
          estadoAtual,
        }).returning('*');

      return res.json(updatedAgenda);
    } catch (error) {
      console.error('Erro ao atualizar agenda:', error);
      next(error);  
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req;

      const agenda = await knex('agendas').where({ id, user_id: userId }).first();

      if (!agenda) {
        throw new AppError('Agenda não encontrada', 404);  
      }

      await knex('agendas').where({ id, user_id: userId }).delete();

      return res.status(204).send();  
    } catch (error) {
      console.error('Erro ao deletar agenda:', error);
      next(error);  
    }
  }
};
