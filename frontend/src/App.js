import { useEffect, useState } from 'react'; 
import './App.css';
import Home from './Components/Home';
import Footer from './Components/Layouts/Footer';
import Header from './Components/Layouts/Header';

import {BrowserRouter as Router , Route} from 'react-router-dom'
import ProductDetails from './Components/Product/ProductDetails';
import Login from './Components/User/Login';
import Register from './Components/User/Register';

// dispaly user info as soon as app starts .....
//  so loadme is dispatched here ,.


import { loadUser } from './actions/usersAction';
import store from './store';
import Profile from './Components/User/Profile';
import ProtectedRoute from './Components/Route/ProtectedRoute';
import UpdateProfile from './Components/User/UpdateProfile';
import UpdatePassword from './Components/User/UpdatePassword';
import ForgetPassword from './Components/User/ForgetPassword';
import NewPassword from './Components/User/NewPassword';
import Cart from './Components/Cart/Cart';
import Shipping from './Components/Cart/Steps/Shipping';
import ConfirmOrder from './Components/Cart/Steps/ConfirmOrder';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Payment from './Components/Cart/Steps/Payment';
import OrderSuccess from './Components/Cart/orderSuccess';
import ListOrders from './Components/Order/ListOrder';
import OrderDetails from './Components/Order/OrderDetails';
import Dashboard from './Components/Admin/Dashboard';
import ProductsList from './Components/Admin/ProductsList';
import NewProduct from './Components/Admin/NewProduct';
import UpdateProduct from './Components/Admin/UpdateProduct';


function App() {

  const [stripeApiKey, setStripeApiKey] = useState("")


  useEffect(() => {
     store.dispatch(loadUser());

     async function getStripApiKey() {
          const { data } = await axios.get('/api/v1/stripeapi');
          setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();

  }, [ ])
  

  return (
    <Router>
    <div className='App'>
              <Header/>
              <div className='container container-fluid'>
                      <Route path='/' component={Home} exact/>
                      <Route path='/login' component={Login }  />
                      <Route path='/register' component={Register }  exact/>
                      <Route path='/password/forgot' component={ForgetPassword }  exact/>
                      <Route path='/password/resetPassword/:token' component={NewPassword }  exact/>

                      <ProtectedRoute path='/me' component={Profile }  exact/>
                      <ProtectedRoute path='/me/update' component={UpdateProfile }   exact/>
                      <ProtectedRoute path='/password/update' component={UpdatePassword} exact/>
                      <Route path='/cart' component={Cart} exact/>
                      <ProtectedRoute path='/shipping' component={Shipping} exact/>
                      <ProtectedRoute path='/confirm' component={ConfirmOrder} />

                      <ProtectedRoute path='/order/:id' component={OrderDetails}  exact/>

                    {
                      stripeApiKey &&  
                      <Elements stripe={loadStripe(stripeApiKey)}>
                                <ProtectedRoute path='/payment' component={Payment}/>
                       </Elements>
                    }
                    <ProtectedRoute path='/success' component={OrderSuccess} />
                    <ProtectedRoute path='/orders/me' component={ListOrders} />



                      
                      <Route path='/search/:keyword' component={Home}  />
                      <Route path='/product/:id' component={ ProductDetails} exact/>
              </div >         
              
                    {/* admin Routes */}

                    <ProtectedRoute isAdmin={true} path='/dashboard' component={Dashboard}/>
                    <ProtectedRoute isAdmin={true} path='/admin/products' component={ProductsList}/>
                    <ProtectedRoute isAdmin={true} path='/admin/product/:id' component={UpdateProduct} exact/>
                    <ProtectedRoute isAdmin={true} path='/admin/product' component={NewProduct} exact/>
                <Footer/>
    </div>
  </Router>
  );
}

export default App;
