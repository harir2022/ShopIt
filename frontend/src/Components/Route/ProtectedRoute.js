import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom';


// get the parameters from route.
function ProtectedRoute({isAdmin, component:Component, ...rest}) {
     const { isAuthenticated, loading ,user} = useSelector(state => state.auth);

  return (
          <>
               { !loading &&(
                    <Route 
                              render={props=>{
                                   if(!isAuthenticated){
                                        return <Redirect to="/login" />;
                                   }
                                   if(isAdmin && user.role!=='admin'){
                                        return <Redirect to="/" />;
                                   }

                                   return <Component {...props} />
                              }}

                              {...rest}
                         />
               )

               }          
          </>
  )
}

export default ProtectedRoute