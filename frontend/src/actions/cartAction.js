import axios from 'axios';

import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from '../constants/cartConstants';


// straight ah product details to cart component ku anupuchierukalam 
// but api call use pana tha nalaerukum ...
// getstate  parameter: - to get current state
export const addItemToCart = (id, quantity) =>  async(dispatch,getState)=>{

     const {data }= await axios.get(`/api/v1/product/${id}`);
     dispatch({
          type: ADD_TO_CART,
          payload: {
              product: data.product._id,
              name: data.product.name,
              price: data.product.price,
              image: data.product.images[0].url,
              stock: data.product.stock,
              quantity
          }
      })
  
     
      //getstate() ---> check this is store.js;
      // chekc the store inside an redux function ;
      // usually done by useSelector() hook;
      localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const removeItemFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const saveShippingInfo = (data) => async (dispatch, getState) => {

    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data 
    })

    localStorage.setItem('shippingInfo', JSON.stringify(data));

}