import pool from './db.js';

async function setupDatabase() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔧 Verificando e ajustando estrutura do banco de dados...\n');

    // Verificar se a tabela Projects existe e tem userId
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'Projects'"
    );

    if (tables.length > 0) {
      console.log('✓ Tabela Projects encontrada');
      
      // Verificar se tem a coluna userId
      const [columns] = await connection.execute(
        "SHOW COLUMNS FROM Projects LIKE 'userId'"
      );

      if (columns.length === 0) {
        console.log('⚠ Coluna userId não encontrada. Adicionando...');
        
        // Verificar se existe a tabela Users primeiro
        const [usersTable] = await connection.execute(
          "SHOW TABLES LIKE 'Users'"
        );

        if (usersTable.length === 0) {
          console.log('⚠ Tabela Users não encontrada. Criando...');
          await connection.execute(`
            CREATE TABLE Users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
          `);
          console.log('✓ Tabela Users criada');
        }

        // Verificar se há projetos existentes
        const [existingProjects] = await connection.execute(
          "SELECT COUNT(*) as count FROM Projects"
        );
        const hasProjects = existingProjects[0].count > 0;

        if (hasProjects) {
          console.log('⚠ Aviso: Existem projetos na tabela. Eles serão associados ao primeiro usuário ou você precisará deletá-los.');
          
          // Verificar se existe pelo menos um usuário
          const [users] = await connection.execute("SELECT id FROM Users LIMIT 1");
          
          if (users.length === 0) {
            console.log('⚠ Nenhum usuário encontrado. Criando usuário padrão...');
            // Criar um usuário padrão (você pode ajustar isso)
            await connection.execute(
              "INSERT INTO Users (name, email, password) VALUES (?, ?, ?)",
              ['Admin', 'admin@admin.com', '$2a$10$dummy'] // Senha dummy, deve ser alterada
            );
            const [newUser] = await connection.execute("SELECT id FROM Users LIMIT 1");
            const defaultUserId = newUser[0].id;
            
            // Adicionar coluna userId como nullable primeiro
            await connection.execute(
              "ALTER TABLE Projects ADD COLUMN userId INT NULL AFTER status"
            );
            
            // Atualizar projetos existentes com o userId padrão
            await connection.execute(
              "UPDATE Projects SET userId = ? WHERE userId IS NULL",
              [defaultUserId]
            );
            
            // Tornar NOT NULL
            await connection.execute(
              "ALTER TABLE Projects MODIFY COLUMN userId INT NOT NULL"
            );
          } else {
            const defaultUserId = users[0].id;
            
            // Adicionar coluna userId como nullable primeiro
            await connection.execute(
              "ALTER TABLE Projects ADD COLUMN userId INT NULL AFTER status"
            );
            
            // Atualizar projetos existentes com o primeiro usuário
            await connection.execute(
              "UPDATE Projects SET userId = ? WHERE userId IS NULL",
              [defaultUserId]
            );
            
            // Tornar NOT NULL
            await connection.execute(
              "ALTER TABLE Projects MODIFY COLUMN userId INT NOT NULL"
            );
          }
        } else {
          // Se não há projetos, podemos adicionar a coluna como NOT NULL diretamente
          await connection.execute(
            "ALTER TABLE Projects ADD COLUMN userId INT NOT NULL AFTER status"
          );
        }

        // Adicionar foreign key
        await connection.execute(
          "ALTER TABLE Projects ADD FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE"
        );

        // Adicionar índice
        await connection.execute(
          "ALTER TABLE Projects ADD INDEX idx_userId (userId)"
        );

        console.log('✓ Coluna userId adicionada com sucesso!');
      } else {
        console.log('✓ Coluna userId já existe');
      }
    } else {
      console.log('⚠ Tabela Projects não encontrada. Criando...');
      
      // Criar tabela Users primeiro se não existir
      const [usersTable] = await connection.execute(
        "SHOW TABLES LIKE 'Users'"
      );

      if (usersTable.length === 0) {
        await connection.execute(`
          CREATE TABLE Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        console.log('✓ Tabela Users criada');
      }

      // Criar tabela Projects
      await connection.execute(`
        CREATE TABLE Projects (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'Ativo',
          userId INT NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
          INDEX idx_userId (userId)
        )
      `);
      console.log('✓ Tabela Projects criada');
    }

    // Verificar tabela Tasks
    const [tasksTable] = await connection.execute(
      "SHOW TABLES LIKE 'Tasks'"
    );

    if (tasksTable.length === 0) {
      console.log('⚠ Tabela Tasks não encontrada. Criando...');
      await connection.execute(`
        CREATE TABLE Tasks (
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
        )
      `);
      console.log('✓ Tabela Tasks criada');
    } else {
      console.log('✓ Tabela Tasks já existe');
    }

    console.log('\n✅ Banco de dados configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco de dados:', error.message);
    throw error;
  } finally {
    connection.release();
  }
}

// Executar se chamado diretamente
setupDatabase()
  .then(() => {
    console.log('\n🎉 Setup concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro no setup:', error);
    process.exit(1);
  });

export default setupDatabase;

