const errorHandling = (err,req,res,next) =>{
    res.status(500).json({
        status:500,
        message:"something went wrong",
        error: err.message
    })
}

export default errorHandling;