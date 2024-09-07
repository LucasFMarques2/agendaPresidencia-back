exports.up = function(knex) {
    return knex.schema.createTable('agendas', table => {
      table.increments('id').primary();
      table.string('titulo').notNullable();
      table.string('descricao').notNullable();
      table.timestamp('dataInicio').notNullable();
      table.timestamp('dataFim').notNullable();
      table.string('local').notNullable();
      table.string('estadoAtual').notNullable();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('agendas');
  };
  