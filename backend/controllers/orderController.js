const catchAsynErrors = require('../middlewares/catchAsynErrors');
const ORDER = require('../models/orders');
const PRODUCT= require('../models/products');
const ErrorHandler = require('../utils/ErrorHandler');

exports.newOrder = catchAsynErrors(async(req,res,next)=>{
     const {
          shippingInfo,
          orderItems,
          paymentInfo,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
     } = req.body;
     const order = await ORDER.create({
          shippingInfo,
          orderItems,
          paymentInfo,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          paidAt:Date.now(),
          user:req.user._id
     })
     res.status(200).json({
          success:true,
          order
     })
})

// api/v1/orders/me
exports.myOrders = catchAsynErrors(async(req,res,next)=>{
     const orders = await ORDER.find({
          user:req.user.id
     });
     res.status(200).json({
          success:true,
          orders
     })
     
})

// get single order of the user 
// api/v1/order/:id
exports.getSingleOrder = catchAsynErrors(async (req,res,next)=>{
     const  order = await ORDER.findById(req.params.id).populate('user','name email');
     if(!order){
          return next(new ErrorHandler(`order not found with id ${req.params.id}`,404));
     }
     res.status(200).json({
          success:true,
          order
     })
})


//admin Routes

// api/v1/admin/orders/
exports.allorders = catchAsynErrors(async (req,res,next)=>{
     const orders = await ORDER.find({});
     let totalPrice = 0;
     orders.forEach((order)=>{
          totalPrice+=order.totalPrice;
     });
     res.status(200).json({
          success:true,
          totalPrice,
          orders
     });
});


//update order status and Product remainnig stock information'

async function updateStock(productId,quantity){
     const product= await PRODUCT.findById(productId);
     product.stock= product.stock - quantity;
     await product.save({validateBeforeSave:false})
     console.log(await PRODUCT.findById(productId));
}

exports.updateOrderStatus =catchAsynErrors(async (req,res,next)=>{
     const order = await ORDER.findById(req.params.id);
     if(!order) 
          return next(new ErrorHandler('no such order exist',404));
     if(order.orderStatus ==="Delivered"){
               return next(new ErrorHandler("You have already Delivered this order",400));
     }
     //may container my items;
     order.orderItems.forEach( async(item)=>{
          await updateStock(item.product,item.quantity)
     });

     order.orderStatus =req.body.status;
     order.deliveredAt=Date.now();

     order.save();
     res.status(200).json({
          success:true,
          msg:'order status updated'
     });
});


//delete order
//api/v1/order/:id
exports.deleteOrder = catchAsynErrors( async (req,res,next)=>{
     const order = await ORDER.findById(req.params.id);
     if(!order) 
          return next(new ErrorHandler('no such order exist',404));
     await order.remove();
     res.status(200).json({
          success: true,
          order
     });
});

