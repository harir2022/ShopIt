const express = require('express');
const { newOrder, getSingleOrder, myOrders, allorders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, isAuthenticatedRole } = require('../middlewares/auth');
const Router = express.Router();

Router.route('/order/new').post(isAuthenticatedUser,newOrder)
Router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)
Router.route('/orders/me').get(isAuthenticatedUser,myOrders);

//admin routes
Router.route('/admin/orders').get(isAuthenticatedUser,isAuthenticatedRole('admin'),allorders);
Router.route('/admin/order/:id')
                              .put(isAuthenticatedUser,isAuthenticatedRole('admin'),updateOrderStatus)// to check delivery status;
                              .delete(isAuthenticatedUser,isAuthenticatedRole('admin'),deleteOrder); // to delete order;

module.exports=Router;