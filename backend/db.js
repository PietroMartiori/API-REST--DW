import mysql from 'mysql2/promise';

const pool = mysql.createPool({
   host: 'localhost',
   user: 'mypietro',
   password: 'pietro123',
   database: 'apirestdw',
   port: 3306,
   waitForConnections: true,
   connectionLimit: 10,
});

export default pool;