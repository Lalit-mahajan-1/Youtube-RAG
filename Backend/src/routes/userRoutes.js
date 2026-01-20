import express from "express";
import {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    loginuser
} from "../controllers/userController.js"
const router = express.Router();

router.get("/user",getAllUsers);
router.post("/user",createUser);
router.post("/login",loginuser)
router.get("/user/:id",getUserById);
router.put("/user/:id",updateUser);
router.delete("/user/:id",deleteUser);

export default router ;