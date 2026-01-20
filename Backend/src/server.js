import dotenv from "dotenv";
dotenv.config(); 
import pool from "./config/db.js";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"
import errorHandling from "./middlewares/errorHandler.js"
import createUserTable from "./data/createUserTable.js";
import requireAuth from "./middlewares/auth.js";
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(errorHandling)


app.use("/api",userRoutes);
app.use(cookieParser());
createUserTable()

app.get("/",requireAuth ,async (req, res) => {
  const result = await pool.query("select current_database()");
  res.send(`result is : ${result.rows[0].current_database}`);
});

app.get("/api/auth/me",requireAuth,async(req,res)=>{
  const id = req.user.id;
  const result = await pool.query('select name,email from users where id=$1',[id]);
  res.json({
    authenticated: true,
    id: req.user.id,
    name:result.rows[0].name,
    email:result.rows[0].email
  });
})


app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
