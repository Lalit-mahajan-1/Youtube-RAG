import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  loginUserService,
} from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const time = 10 * 24 * 60 * 60;

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET, {
    expiresIn: time,
  });
};


export const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const newUser = await createUserService(name, email, password);

    handleResponse(res, 201, "User Created Successfully", newUser);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const User = await getAllUsersService();
    handleResponse(res, 200, "All user fetched Successfully", User);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const User = await getUserByIdService(id);
    if (!User) return handleResponse(res, 404, "user not found");
    handleResponse(res, 200, "user fetched Successfully", User);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email } = req.body;
  try {
    const User = await updateUserService(id, name, email);
    if (!User) return handleResponse(res, 404, "user not found");
    handleResponse(res, 200, "user updated Successfully", User);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const User = await deleteUserService(id);
    if (!User) return handleResponse(res, 404, "user not found");
    handleResponse(res, 200, "user deleted Successfully", User);
  } catch (error) {
    next(error);
  }
};

export const loginuser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await loginUserService(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user.id);

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: time * 1000, 
    });

    
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    next(error);
  }
};


export const logoutUser = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
