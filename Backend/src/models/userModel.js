import pool from "../config/db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const getAllUsersService = async () => {
  const result = await pool.query("select * from users");
  return result.rows;
};

export const getUserByIdService = async (id) => {
  const result = await pool.query("select * from users where id = $1", [id]);
  return result.rows[0];
};

export const createUserService = async (name, email, password) => {
  const saltRounds = Number(process.env.SALTROUNDS);
  const salt = bcrypt.genSaltSync(saltRounds);

  const hash = bcrypt.hashSync(password, salt);
  const result = await pool.query(
    "insert into users (name,email,password) values ($1,$2,$3) returning *",
    [name, email, hash],
  );

  return result.rows[0];
};

export const updateUserService = async (id, name, email) => {
  const result = await pool.query(
    "update users set name = $1 , email=$2 where id = $3 returning *",
    [name, email, id],
  );

  return result.rows[0];
};

export const deleteUserService = async (id) => {
  const result = await pool.query("delete from users where id=$1 returning *", [
    id,
  ]);

  return result.rows[0];
};

export const loginUserService = async (email) => {
  const result = await pool.query(
    "select id,name,password from users where email=$1",
    [email],
  );

  return result.rows[0];
};
