-- Script de criação/atualização do banco de dados
-- Execute este script no MySQL para criar as tabelas necessárias

USE apirestdw;

-- Criar tabela de usuários (se não existir)
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de projetos (se não existir)
CREATE TABLE IF NOT EXISTS Projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Ativo',
  userId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  INDEX idx_userId (userId)
);

-- Se a tabela Projects já existir mas não tiver userId, adicionar a coluna
-- Descomente as linhas abaixo se necessário:
-- ALTER TABLE Projects ADD COLUMN userId INT NOT NULL AFTER status;
-- ALTER TABLE Projects ADD FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE;
-- ALTER TABLE Projects ADD INDEX idx_userId (userId);

-- Criar tabela de tarefas (se não existir)
CREATE TABLE IF NOT EXISTS Tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Pendente',
  projectId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (projectId) REFERENCES Projects(id) ON DELETE CASCADE,
  INDEX idx_projectId (projectId),
  CHECK (status IN ('Pendente', 'Em Andamento', 'Concluída'))
);

-- Se a tabela Tasks já existir mas não tiver a estrutura correta, ajustar:
-- ALTER TABLE Tasks MODIFY COLUMN status VARCHAR(50) DEFAULT 'Pendente';
-- ALTER TABLE Tasks ADD CONSTRAINT chk_status CHECK (status IN ('Pendente', 'Em Andamento', 'Concluída'));

