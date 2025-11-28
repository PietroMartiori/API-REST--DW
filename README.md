# API REST (Gerenciamento de Tarefas e Projetos)
<br>

# Tecnologias utilizadas

## Frontend 

- React.js
- Vite
- JavaScript (ES6+)
- Axios


## Backend 

- Node.js
- Express.js
- CORS
- Dotenv
- Bcrypt 
- Jsonwebtoken 
- Mysql2 
- Nodemon

## Banco de Dados

- MySQL (Workbench)

<br>

# Como rodar o projeto

## Pré-requisitos

- Node.js e npm instalados

- Banco de dados MySQL instalado e aberto

## Instalação e Configuração 
1. **Clone o repositório**
- git clone https://github.com/PietroMartiori/API-REST--DW
- cd API-REST--DW

2. **Configure o banco de dados**

- No seu servidor MySQL, copie e cole todo o conteúdo da pasta = database.sql dentro do backend.

3. **Backend**
- cd backend
- npm install

4. **Inicie o servidor backend**
- node server.js ou npm start (deve retornar Servidor rodando na porta 3000)

5. **Frontend**
- cd ../frontend
- npm install
- npm run dev

- Acesse a API backend via http://localhost:3000