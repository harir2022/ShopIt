const  mongoose = require('mongoose')
const validator = require('validator');
const  crypto = require('crypto');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name:{
        type:String , 
        required:[true,"Please enter your name "],
        maxLength:[45 , 'Your name cannot exceed 45 characters'],
    },
    email:{
        type:String , 
        required:[true,"Please enter your Email "],
        unique:[true,"Already exist"],
        validate:   [validator.isEmail,"Please enter valid email"]
    },
    password:{
        type:String, 
        required:[true,'Please enter the password'],
        minLength:[6,'your password should contains atleast 6 characters'],
        select:false
    },
    avator:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        }

    },
    role:{
        type:String,
        default:'user'
    },
    createAt:{
        type:Date,
        default:Date.now
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

})

// to hash the password
UserSchema.pre('save', async function(next){
    if(!this.isModified('password'))
        next();
    this.password = await  bcrypt.hash(this.password,10);

});

// to store the data as token;
// passed as object.getJwtToken();
UserSchema.methods.getJwtToken =  function(){
        return jwt.sign({id:this._id},process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_TIME
        })
}


// comparre enter password with UserPassword;

UserSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

UserSchema.methods.getResetPassword = function(){

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest("hex");
    this.resetPasswordExpire= Date.now()+ 30*60*1000; // 30 minutes;
    console.log(resetToken);
    return resetToken;
}


module.exports=mongoose.model('User',UserSchema)