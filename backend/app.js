const express=require('express');
const cors = require('cors')
const bodyparser=require('body-parser')
const cookieParser = require('cookie-parser');
const expressFileUpload = require('express-fileupload');

const app=express();

// updated after stirpe component ;
const dotenv=require('dotenv');
dotenv.config({path:'backend/config/config.env'});

app.use(express.json({
     limit: '50mb'
   }));
   
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressFileUpload());

app.use(
  cors({
    origin: 'https://shopit-now.netlify.app', // Replace with the allowed origin(s) for your frontend app
    methods: '*', // Allow all HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  })
);




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