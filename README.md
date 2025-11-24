# API-REST--DW

## Autenticação JWT

1. Crie um arquivo `backend/.env` com os valores:
   ```
   PORT=3000
   JWT_SECRET=sua-chave-super-secreta
   JWT_EXPIRES_IN=1h
   ```
2. No diretório `backend`, instale as dependências:
   ```
   npm install
   ```
3. Faça uma requisição `POST /auth/login` com JSON:
   ```json
   {
     "email": "usuario@exemplo.com",
     "senha": "senhaDoUsuario"
   }
   ```
   A resposta inclui o token JWT e os dados básicos do usuário.
4. Utilize o token retornado no header `Authorization: Bearer <token>` para acessar qualquer rota de projetos (`/projetos`) ou tarefas (`/tarefas`). Sem esse header válido a API responde `401`.
5. Para cadastrar usuários, use `POST /auth/register` com:
   ```json
   {
     "nome": "Nome do Usuário",
     "email": "usuario@exemplo.com",
     "senha": "senhaSegura"
   }
   ```
   O cadastro também retorna um token e os dados do usuário autenticado.

## Frontend (Vite + React)

1. Crie um arquivo `frontend/.env` com a URL do backend:
   ```
   VITE_API_URL=http://localhost:3000
   ```
2. Instale dependências do frontend:
   ```
   cd frontend
   npm install
   ```
3. Suba o app:
   ```
   npm run dev
   ```
4. Faça login com um usuário válido para liberar o dashboard de projetos/tarefas.