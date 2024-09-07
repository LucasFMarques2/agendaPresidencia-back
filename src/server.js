require('dotenv').config();
const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const AppError = require('./utils/AppError');

const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(routes);  

app.use((err, req, res, next) => {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }
  
    console.error(err);  
    return res.status(500).json({
      status: 'error',
      message: 'Erro interno do servidor',
    });
  });

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
