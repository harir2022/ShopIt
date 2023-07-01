import React,{useEffect} from 'react'
import { Link, Route } from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import {useAlert  }   from 'react-alert'

import '../../App.css'
import Search from './Search'



import {logout} from '../../actions/usersAction'

function Header() {
     const  alert = useAlert();
     const dispatch = useDispatch();

     const { user,loading } = useSelector(state => state.auth) ;
     const { cartItems} = useSelector(state => state.cart) ;

     const logoutHandler = (e) =>{
          dispatch(logout());
          alert.success("Logged out successfully")
     }
     

  return (
    <div>
     <nav className="navbar row">
                    <div className="col-12 col-md-3">
                         <div className="navbar-brand">
                              <Link to="/">
                                        <img src="./Images/shopit_logo.png" alt='ShopIt' />
                              </Link>
                         </div>
                    </div>

               <div className="col-12 col-md-6 mt-2 mt-md-0">
                         {/* //search; */}
                         <Route render={({history})=><Search history={history}     />}/>
               </div>

                    <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                         
                         <Link to="/cart" style={{textDecoration:'none' , marginRight:"16px"}}>
                                   <span id="cart" className="ml-3">Cart</span>
                                   <span className="ml-1" id="cart_count">{cartItems.length}</span>
                         </Link>
                         
                         {/* profile icon in home scrren  */}
                       {  
                         user?(
                              <div className="ml-4 dropdown d-inline">
                                    <Link to="#!" className="btn dropdown-toggle text-white mr-5" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                  <figure className="avatar avatar-nav">
                                                            <img
                                                                 src={user.avator && user.avator.url}
                                                                 alt={user && user.name}
                                                                 className="rounded-circle"
                                                              />  <span>{user && user.name}</span>
                                                  </figure>
                                   </Link>

                                   <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">

                                                  {user && user.role === 'admin' && (
                                                  <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                                                  )}
                                                  <Link className="dropdown-item" to="/orders/me">Orders</Link>
                                                  <Link className="dropdown-item" to="/me">Profile</Link>
                                                  <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                                                                 Logout
                                                  </Link>

                                        </div>

                              </div>

                         ): !loading &&   <Link  to="/login" className="btn" id="login_btn">Login</Link>
                       }

                    </div>
          </nav>
    </div>
  )
}

export default Header