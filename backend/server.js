const app = require('./app');
const dotenv=require('dotenv');

// dbfile
const connectDatabase = require('./config/database')

dotenv.config({path:'backend/config/config.env'});

// if log undefined variable in server.js
process.on('uncaughtException',err=>{
    console.log("Error:"+err.message);
    console.log(`SHUTTING DOWN DUE TO UNCAUGHT EXCEPTION`);
    process.exit(1);
})
// console.log(e);


//cloudinary 
const cloudinary = require('cloudinary');
cloudinary.config({ 
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
     api_key: process.env.CLOUDINARY_API_KEY, 
     api_secret: process.env.CLOUDINARY_API_SECRET, 
   });




connectDatabase();
const server = app.listen(process.env.PORT,()=>{
    console.log(`working on the ${process.env.PORT} + ${process.env.NODE_ENV} MODE  `);
})


// Handle Unhandled Error; eg:change mongo://localhost:27017/shopit;
process.on('unhandledRejection',err=>{
    console.log('Error:'+err.message);
    console.log('SHUTTING DOWN DUE TO UNHANDLE PROMISE REJECTION ');
    server.close(()=>{
        process.exit(1);
    })
})