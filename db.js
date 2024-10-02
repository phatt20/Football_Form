import pkg from 'pg'; 
const { Pool } = pkg; 

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "world",
  password:"115120",
  port: 5432,               
});

pool.connect()
  .then(client => {
    console.log('Connected to the database');
    client.release();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });

export default pool;
