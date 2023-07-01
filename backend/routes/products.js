const express = require('express');
const Router = express.Router();

const {getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createProductReview, getProductReview, deleteReview, getAdminProducts} = require('../controllers/productController')


Router.route('/products').get(getProducts);
Router.route('/product/:id').get(getSingleProduct);



//authentication of routers;
const {isAuthenticatedUser , isAuthenticatedRole} = require('../middlewares/auth');




// only ADMIN can add and edit PRODUCTS
Router.route('/admin/products/').get(isAuthenticatedUser,isAuthenticatedRole('admin'),getAdminProducts);

Router.route('/admin/product/new').post(isAuthenticatedUser,isAuthenticatedRole('admin'),newProduct);

Router.route('/admin/product/:id')
    .put(isAuthenticatedUser,isAuthenticatedRole('admin'),updateProduct)
    .delete(isAuthenticatedUser,isAuthenticatedRole('admin'),deleteProduct)

//review;

Router.route('/review').put(isAuthenticatedUser,createProductReview);

Router.route('/reviews')
        .get(isAuthenticatedUser,getProductReview)
        .delete(isAuthenticatedUser,deleteReview);




module.exports=Router;