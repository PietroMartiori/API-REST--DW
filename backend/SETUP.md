# Setup do Banco de Dados

## Problema: Erro "Coluna desconhecida 'userId'"

Este erro ocorre porque a tabela `Projects` não tem a coluna `userId` que é necessária para associar projetos aos usuários.

## Solução Rápida

Execute o script de setup do banco de dados:

```bash
cd backend
npm run setup-db
```

Este script irá:
- ✅ Verificar se a tabela `Projects` existe
- ✅ Adicionar a coluna `userId` se ela não existir
- ✅ Criar as tabelas `Users` e `Tasks` se necessário
- ✅ Configurar as foreign keys e índices

## Solução Manual (SQL)

Se preferir executar manualmente, use o arquivo `database.sql`:

```bash
mysql -u root -p apirestdw < database.sql
```

Ou execute no MySQL:

```sql
USE apirestdw;

-- Adicionar coluna userId se não existir
ALTER TABLE Projects ADD COLUMN userId INT NOT NULL AFTER status;

-- Adicionar foreign key
ALTER TABLE Projects ADD FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE;

-- Adicionar índice
ALTER TABLE Projects ADD INDEX idx_userId (userId);
```

**Nota:** Se você já tem projetos na tabela, você precisará associá-los a um usuário existente ou deletá-los antes de adicionar a coluna `userId` como `NOT NULL`.

## Estrutura Esperada das Tabelas

### Tabela Users
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(255))
- email (VARCHAR(255), UNIQUE)
- password (VARCHAR(255))
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Tabela Projects
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(255))
- description (TEXT)
- status (VARCHAR(50), DEFAULT 'Ativo')
- **userId (INT, NOT NULL, FOREIGN KEY → Users.id)**
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Tabela Tasks
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- title (VARCHAR(255))
- description (TEXT)
- status (VARCHAR(50), DEFAULT 'Pendente', CHECK IN ('Pendente', 'Em Andamento', 'Concluída'))
- projectId (INT, FOREIGN KEY → Projects.id)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

