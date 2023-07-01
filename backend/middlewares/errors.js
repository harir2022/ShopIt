const ErrorHandler = require('../utils/ErrorHandler')

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errorMessage:err.message,
            stack:err.stack
        })
    }
    else if(process.env.NODE_ENV==='PRODUCTION')
    {
        // err.message = err.message || "Internal Server Error";

        let error= {...err};
        error.message=err.message;

        //wrong object id error;
        if(err.name === 'CastError'){
            message = `RESOURCES NOT FOUND . INVALID :${err.path}`
            error= new ErrorHandler(message,400);
        }

        //validation eroor;
        if(err.name =='ValidatorError'){
            message= Object.values(err.errors).map((value)=>(value.message));
            error=new ErrorHandler(message,400); //400 bad request;
            
        }
        // duplication on registering ;
        if(err.code === 11000){
            // const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            const message = `Duplicate Email entered`;
            error = new ErrorHandler(message,400);
        }

        //Handling Wrong Json Web Token Error;

        if(err.name =='JsonWebTokenError'){
            const message ='Json web Tokne is invalid . Try Again',
            error = new ErrorHandler(message,400);
        }
        
        // Handling Expired Json Web Token 

        if(err.name =='TokenExpiredError'){
            const message ='Json web Tokne is Expired . Try Again',
            error = new ErrorHandler(message,400);
        }
        
        res.status(error.statusCode).json({
            success:false,
            errorMessage:error.message || "Internal Server Error"
        })  
    }   
}



