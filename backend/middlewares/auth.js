const jwt = require('jsonwebtoken');

const USER = require('../models/users')
const catchASyncErrors = require('./catchAsynErrors');
const ErrorHandler = require('../utils/ErrorHandler');

// is user authenticated ? 
exports.isAuthenticatedUser = catchASyncErrors(async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token) {
        return next(new ErrorHandler('LOGIN FIRST TO ACCESS THE RESOURCES',403));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await USER.findById(decoded.id); // forgot to put await troubled roles;
    
    next();
}); 


// who is this user ? admin or user ;
exports.isAuthenticatedRole = (...roles)=>{
    
    return (req, res, next)=>{
            if(!roles.includes(req.user.role)){
                return next(
                    new ErrorHandler(`Role ${req.user.role} cannot be allowed to accesss resoures `,403)
                )
            }
            next();
}}