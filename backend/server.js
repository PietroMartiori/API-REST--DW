import express from "express";
import cors from "cors";
import projetoRoutes from './routes/projetoRoutes.js';
import tarefaRoutes from './routes/tarefaRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware para desenvolvimento
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas públicas (autenticação)
app.use('/auth', authRoutes);

// Rotas protegidas (requerem autenticação)
app.use('/projetos', projetoRoutes);
app.use('/tarefas', tarefaRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: "API de Projetos e Tarefas funcionando!",
    version: "1.0.0",
    endpoints: {
      auth: "/auth",
      projetos: "/projetos",
      tarefas: "/tarefas"
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: "Rota não encontrada",
    path: req.path
  });
});

// Configuração do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API disponível em: http://localhost:${PORT}`);
});
