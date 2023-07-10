const express=require('express');

const bodyparser=require('body-parser')
const cookieParser = require('cookie-parser');
const expressFileUpload = require('express-fileupload');
const  cors = require('cors')
const app=express();

// updated after stirpe component ;
const dotenv=require('dotenv');
dotenv.config({path:'backend/config/config.env'});


const corsOptions ={
    origin:'https://shopit-now.netlify.app', 
    credentials:true,
}
app.use(cors(corsOptions));


app.use(express.json({
     limit: '50mb'
   }));
   
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressFileUpload());




//import all routes (app.js->routesFolder ->controllerFolder)
const products = require('./routes/products')
app.use("/api/v1",products);

const auth = require('./routes/auth');
app.use("/api/v1",auth);

const payments= require('./routes/payment')
app.use('/api/v1',payments)

const order = require('./routes/order')
app.use('/api/v1',order);




const middleware = require('../backend/middlewares/errors');

// custom middle wares ;
app.use(middleware); // to handle errors




module.exports=app;
