import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import errorHandling from "./middlewares/errorHandler.js"
import createUserTable from "./data/createUserTable.js";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(errorHandling)


app.use("/api",userRoutes);
createUserTable()
app.get("/", async (req, res) => {
  const result = await pool.query("select current_database()");
  res.send(`result is : ${result.rows[0].current_database}`);
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
