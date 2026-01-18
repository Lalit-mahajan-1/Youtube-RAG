import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config(); 

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

pool.on("connect", () => {
  console.log("connection pool established with database");
});

export default pool;
