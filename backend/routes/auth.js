const express = require('express');
const Router = express.Router();

const {registerUser, loginUser,logout, forgetPassword,resetPassword, getProfileDetails, updatePassword, updateProfileDetails, getAllUsers, getSpecificUser, updateUser, deleteUser}= require('../controllers/authController');
const { isAuthenticatedUser, isAuthenticatedRole } = require('../middlewares/auth');


Router.route('/register').post(registerUser);
Router.route('/login').post(loginUser);

Router.route('/logout').get(logout);

//generate and send resetToken to email
Router.route('/password/forgetPassword').post(forgetPassword);


// new Password 
Router.route('/password/resetPassword/:token').put(resetPassword);

// get proflie details
//api/v1/me
Router.route('/me').get(isAuthenticatedUser,getProfileDetails);
Router.route('/me/update').put(isAuthenticatedUser,updateProfileDetails);
Router.route('/password/update').put(isAuthenticatedUser,updatePassword);

//api/v1/admin/users
Router.route('/admin/users').get(isAuthenticatedUser,isAuthenticatedRole('admin'),getAllUsers);
Router.route('/admin/user/:id')
                                   .get(isAuthenticatedUser,isAuthenticatedRole('admin'),getSpecificUser)
                                   .put(isAuthenticatedUser,isAuthenticatedRole('admin'),updateUser)
                                   .delete(isAuthenticatedUser,isAuthenticatedRole('admin'),deleteUser);






module.exports = Router;
