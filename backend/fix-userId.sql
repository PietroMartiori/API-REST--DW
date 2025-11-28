-- Script rápido para adicionar a coluna userId na tabela Projects
-- Execute este script no MySQL se você receber o erro "Coluna desconhecida 'userId'"

USE apirestdw;

-- Verificar se a coluna já existe (não vai dar erro se já existir)
-- Se der erro, significa que a coluna não existe e precisa ser criada

-- Opção 1: Se você NÃO tem projetos na tabela (mais simples)
-- Descomente as linhas abaixo:
-- ALTER TABLE Projects ADD COLUMN userId INT NOT NULL AFTER status;
-- ALTER TABLE Projects ADD FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE;
-- ALTER TABLE Projects ADD INDEX idx_userId (userId);

-- Opção 2: Se você JÁ TEM projetos na tabela
-- Primeiro, você precisa ter pelo menos um usuário cadastrado
-- Depois, execute:

-- Passo 1: Adicionar coluna como nullable
ALTER TABLE Projects ADD COLUMN userId INT NULL AFTER status;

-- Passo 2: Associar projetos existentes ao primeiro usuário (ajuste o ID se necessário)
-- IMPORTANTE: Substitua 1 pelo ID do seu usuário ou crie um usuário primeiro
UPDATE Projects SET userId = (SELECT id FROM Users LIMIT 1) WHERE userId IS NULL;

-- Passo 3: Tornar a coluna NOT NULL
ALTER TABLE Projects MODIFY COLUMN userId INT NOT NULL;

-- Passo 4: Adicionar foreign key
ALTER TABLE Projects ADD FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE;

-- Passo 5: Adicionar índice
ALTER TABLE Projects ADD INDEX idx_userId (userId);

