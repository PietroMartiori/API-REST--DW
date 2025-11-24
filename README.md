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

1. Instale dependências do frontend:
   ```
   cd frontend
   npm install
   ```
2. Suba o app:
   ```
   npm run dev
   ```
3. Faça login ou cadastre um usuário. O frontend já consome `http://localhost:3000` diretamente, então não é necessário arquivo `.env`.