export const ErrorHandler= (error,req,res,next)=>{
    console.log(error.message);
    next();
}