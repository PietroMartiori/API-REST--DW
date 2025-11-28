import express from "express";
import cors from "cors";
import projetoRoutes from './routes/projetoRoutes.js';
import tarefaRoutes from './routes/tarefaRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();


app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/auth', authRoutes);

app.use('/projetos', projetoRoutes);
app.use('/tarefas', tarefaRoutes);

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

app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: "Erro interno do servidor",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: "Rota não encontrada",
    path: req.path
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
