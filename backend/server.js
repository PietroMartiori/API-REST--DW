import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projetoRoutes from './routes/projetoRoutes.js';
import tarefaRoutes from './routes/tarefaRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authenticate from './middlewares/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/projetos', authenticate, projetoRoutes);
app.use('/tarefas', authenticate, tarefaRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: "API de Projetos e Tarefas funcionando!" });
});

app.listen(PORT, () => {
   console.log(`Servidor rodando na porta ${PORT}`);
});
