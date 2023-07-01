const crypto = require('crypto')
const Users = require('../models/users');
const catchASyncErrors = require('../middlewares/catchAsynErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const sendToken= require('../utils/jwtToken');
const users = require('../models/users');

const cloudinary = require('cloudinary');

//api/v1/register
exports.registerUser = catchASyncErrors(async (req, res, next) => {
                    // console.log("register user initiated");
                    //avatar is misspelled as avators in db
                    // only validated data is accepted;...
                    console.log(req.body)
                const cloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                    folder: 'avatars',
                    width: 150,
                    crop: "scale"
                })
                // console.log(req.body.avatar)
                const { name, email, password } = req.body;
                const user = await Users.create({
                    name,
                    email,
                    password,
                    avator:{
                        // this will be caried out in frontend;
                        public_id:cloud.public_id,
                        url: cloud.secure_url,
                    }
                })               
               

                sendToken(user, 200, res);
})


//api/v1/login/
exports.loginUser = catchASyncErrors(async (req,res,next)=>{    
    const {email,password} = req.body;

    // check if email , password is present 
    if(!email ||!password){
        return next(new ErrorHandler('Invalid Email or Password',401));
    }

    // find user in db;
    const user =await Users.findOne({email}).select("+password");
 
    if(!user){
        return next(new ErrorHandler('Invalid Email or Password',401));
    }

    // check if password is correct or not ;

    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid Passwored',401));
    }

    sendToken(user,200,res);
    

})

//api/v1/logout/
exports.logout = catchASyncErrors(async (req,res,next)=>{
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.json({
        success: true,
        message:'successfully logged out'
    })
})

//api/v1/password/forgetPassword;
const sendMail= require('../utils/NodeMailer');

exports.forgetPassword = catchASyncErrors( async (req,res,next)=>{
    const email = await Users.findOne({email:req.body.email})
    if(!email) 
        return next(new ErrorHandler('Email Not Found',404));

    // get resetToken;
    const resetToken= email.getResetPassword(); 
    
    await email.save({validateBeforeSave:false});

    // const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/password/resetPassword/${resetToken}`;
    const resetUrl=`${process.env.FRONTEND_URL}/password/resetPassword/${resetToken}`;
    
    try {
        
        sendMail({
            toEmail:email.email,
            subject: 'Password Reset',
            message: `Your Password reset Token Follows :\n\n\ ${resetUrl}\n\n If you not requested Kindly Ignore it!`
        })
        res.status(200).json({
            success: true,
            message: `email send to ${email.email}`
        })

    } catch (err) {
        email.resetPasswordToken=undefined;
        email.resetPasswordExpires=undefined;
        await email.save({validateBeforeSave:false});

        return next(new ErrorHandler(err.message,500));
    }

});

exports.resetPassword = catchASyncErrors(async(req,res,next)=>{
    // console.log("reset password linke ")
const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await Users.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt:Date.now()}
    })
    if(!user){
        return next(new ErrorHandler('Link is Invalid or Expired',400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',400))
    }

    user.password=req.body.password;
    

    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;
    await user.save();

    sendToken(user,200,res); // cookie storing
    
})


//get details of current user;

exports.getProfileDetails= catchASyncErrors(async(req,res,next)=>{
    const {id}= req.user;
    const user = await Users.findById(id);
    res.status(200).json({
        success:true,
        user
    })
})

exports.updatePassword = catchASyncErrors(async(req,res,next)=>{
    // console.log(req.body.newPassword + "  " + req.body.oldPassword)
        const user = await Users.findById(req.user.id).select('+password');
        const isMatched = await user.comparePassword(req.body.oldPassword);
        if(!isMatched){
            return next(new ErrorHandler('old Password is incorrect'),400);
        }
        user.password = req.body.newPassword;
        await user.save();

        sendToken(user,200,res);

})

exports.updateProfileDetails = catchASyncErrors(async(req,res,next)=>{
    const newDetails ={
        name:req.body.name,
        email:req.body.email,
    }
   
    if(req.body.avatar!=""){
        const user = await Users.findById(req.user.id);
        const imageId = user.avator.public_id;
        const destroy = await cloudinary.v2.uploader.destroy(imageId);// cleared old image'
        
        //new imageupload               
        const cloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })
        newDetails.avator={
            // this will be caried out in frontend;
            public_id:cloud.public_id,
            url: cloud.secure_url,
        }
      
    }

    const user =await  Users.findByIdAndUpdate(req.user.id,newDetails,{
        new:true,
        runValidators:true,
        useFindAndModify:false,        
    })
    //TODO: update profile photos
    res.status(200).json({
        success:true,
    })

})


//admin 
//get all user details
exports.getAllUsers = catchASyncErrors(async(req,res,next)=>{
    const users = await Users.find();
    
    res.status(200).json({
        success:true,
        users
    })
})

//get specific user
exports.getSpecificUser = catchASyncErrors(async(req,res,next)=>{
    const user = await Users.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User doesnot exist with this id :${req.params.id}`,400));
    }
    res.status(200).json({
        success:true,
        user
    })
})

exports.updateUser = catchASyncErrors(async(req,res,next)=>{
    const newDetails ={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }
    const user =await  Users.findByIdAndUpdate(req.params.id,newDetails,{
        new:true,
        runValidators:true,
        useFindAndModify:false,        
    })
    //TODO: update profile photos
    res.status(200).json({
        success:true,
        user
    })
})

exports.deleteUser = catchASyncErrors(async(req,res,next)=>{
    const user = await Users.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`user doesnot found with id ${req.params.id}`));
    }
    await user.remove();
    //TODO: remove profile image ;
    res.status(200).json({
        success:true,
        user
    })
    
})