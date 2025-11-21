import express from "express";
import cors from "cors";
import projetoRoutes from './routes/projetoRoutes.js';
import tarefaRoutes from './routes/tarefaRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/projetos', projetoRoutes);
app.use('/tarefas', tarefaRoutes);

app.get('/', (req, res) => {
    res.json({ message: "API de Projetos e Tarefas funcionando!" });
});

app.listen(3000, () => {
   console.log("Servidor rodando na porta 3000");
});
