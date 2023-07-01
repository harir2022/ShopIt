import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { newProductReducer, productDetailsReducer, productReducer, productsReducer, reviewReducer } from './reducers/productsReducer';
import { authReducer, userReducer,forgotPasswordReducer } from './reducers/usersReducer';
import {cartReducer} from './reducers/cartReducer'
import { myOrdersReducer, orderDetailsReducer, orderReducer } from './reducers/orderReducer';


const reducer = combineReducers({ 
   auth:authReducer,
   user:userReducer,
   products:productsReducer,
   product:productReducer,
   productDetails:productDetailsReducer,
   forgotPassword:forgotPasswordReducer,
   cart: cartReducer  ,
   newOrder:orderReducer,
   myOrders:myOrdersReducer,
   orderDetails:orderDetailsReducer,
   newReview:reviewReducer,
   newProduct:newProductReducer
})


let initialState = {
    cart:{
            cartItems: localStorage.getItem('cartItems') 
                                    ? JSON.parse(localStorage.getItem('cartItems'))
                                    : [],
            shippingInfo:localStorage.getItem('shippingInfo')
                                    ? JSON.parse(localStorage.getItem('shippingInfo'))
                                    :{}
    }
}

const middlware = [thunk];
const store = createStore(
               reducer, 
               initialState, 
               composeWithDevTools(applyMiddleware(...middlware))
)

export default store;