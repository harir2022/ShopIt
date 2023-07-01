const catchASyncErrors = require('../middlewares/catchAsynErrors');


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Process stripe payments   =>   /api/v1/payment/process
exports.processPayment = catchASyncErrors(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        metadata: { integration_check: 'accept_a_payment' }
    });
    
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })

})


// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchASyncErrors(async (req, res, next) => {
    // console.log(process.env.STRIPE_API_KEY)
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })

})