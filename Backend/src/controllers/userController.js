import { createUserService, getAllUsersService 
    ,getUserByIdService,updateUserService,deleteUserService
} from "../models/userModel.js";

const handleResponse = (res,status,message , data =null) =>{
    res.status(status).json({
        status,message,data
    })
}

export const createUser = async (req,res,next) =>{
    const {name,email,password} = req.body;
    try{
        const newUser = await createUserService(name,email,password);
        handleResponse(res,201,"User Created Successfully",newUser)
    }
    catch(error){
       next(error);
    }
}

export const getAllUsers = async(req,res,next) =>{
    try{
        const User = await getAllUsersService();
        handleResponse(res,200,"All user fetched Successfully",User)
    }
    catch(error){
        next(error);
    }
}

export const getUserById = async(req,res,next) =>{
    const id = req.params.id;
    try{
        const User = await getUserByIdService(id);
        if(!User) return handleResponse(res,404 ,"user not found");
        handleResponse(res,200,"user fetched Successfully",User)
    }
    catch(error){
        next(error);
    }
}

export const updateUser = async(req,res,next) =>{
    const id = req.params.id;
    const {name,email} = req.body;
    try{
        const User = await updateUserService(id,name,email);
        if(!User) return handleResponse(res,404 ,"user not found");
        handleResponse(res,200,"user updated Successfully",User)
    }
    catch(error){
        next(error);
    }
}

export const deleteUser = async(req,res,next) =>{
    const id = req.params.id;
    try{
        const User = await deleteUserService(id);
        if(!User) return handleResponse(res,404 ,"user not found");
        handleResponse(res,200,"user deleted Successfully",User)
    }
    catch(error){
        next(error);
    }
}
