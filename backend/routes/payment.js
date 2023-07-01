const express = require('express');
const Router = express.Router();


const { processPayment, sendStripApi } = require('../controllers/paymentController');
const {isAuthenticatedUser} = require('../middlewares/auth')

Router.route('/payment/process').post(isAuthenticatedUser,processPayment);
Router.route('/stripeapi').get(isAuthenticatedUser,sendStripApi);


module.exports =Router;