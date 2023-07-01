import React, { useEffect, useState } from 'react'
import '../App.css'
import {useDispatch,useSelector} from 'react-redux'

//filter in home page;
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';



import MetaData from './Layouts/MetaData'
import {getProducts} from '../actions/productsAction'
import Product from './Product/Product'
import Loader from './Layouts/Loader'
import { useAlert } from 'react-alert'
import Pagination from 'react-js-pagination'



const {createSliderWithTooltip}= Slider;
const Range= createSliderWithTooltip(Slider.Range);

function Home({match}) {
     // console.log("first")
     const alert =useAlert();
     const [currentPage, setCurrentPage] = useState(1);
     
     const [price, setPrice] = useState([1,1000]);

     const [category, setCategory] = useState("");
     const [rating, setRating] = useState(0);


     const categories=[
          'Electronics',
          'Cameras',
          'Laptops',
          'Accessories',
          'Headphones',
          'Food',
          'Books',
          'Clothes/Shoes',
          'Beauty/Health',
          'Sports',
          'Outdoor',
          'Home'
     ]
     


     const {loading,products,error,resPerPage,productsCount,filteredProductsCount} = useSelector(state=>state.products);

     const keyword=match.params.keyword ;

     const dispatch = useDispatch();

     useEffect(() => {
          dispatch(getProducts(keyword,currentPage,price,category,rating))
          if(error){
               return alert.error(error);  //alert.success("welcome da");
          }                 
          
     }, [dispatch,error,alert,keyword,currentPage,price,category,rating]);
    
     function setCurrentPageno(page){
          setCurrentPage(page);
     }

     //show pagination only on condition
     let count=productsCount;
     if(filteredProductsCount){
          count=filteredProductsCount
     }



     if(loading) return <Loader/>  
     return (
    <div className='container container-fluid'>
          <MetaData title={"Best buy online " }/>
          <h1 id='products_heading'>Latest Product</h1>
          <section id="products" className="container mt-5">
               <div className="row">
                    {
                       keyword?(
                              <>
                                   <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                             <Range 
                                                       marks={
                                                                 {1:`$1`,1000:`$1000`}
                                                            }
                                                            min={1}
                                                            max={1000}
                                                            defaultValue={[1,1000    ]}
                                                            tipFormatter={value=>`$${value}`}
                                                            tipProps={{
                                                                 placement:'top',
                                                                 visible: true 
                                                            }}
                                                            value={price}
                                                            onChange={price=>setPrice(price)}
                                                  />
                                             {/* category */}
                                                  <hr className="my-5" />
                                                  <div className="mt-5">
                                                       <h4 className="mb-5">
                                                            Categories:
                                                       </h4>
                                                       <ul className="pl-0">
                                                            {
                                                                categories.map(c=>(
                                                                 <li
                                                                 style={{cursor:'pointer' , listStyleType:'none'}} 
                                                                 key={c}
                                                                 onClick={()=>setCategory(c)}
                                                                >{c}
                                                                </li>                                                                 
                                                                ))
                                                            }
                                                       </ul>
                                                  </div>
                                                  {/* Rating */}
                                                  <hr className="my-5" />
                                                  <div className="mt-5">
                                                       <h4 className="mb-5">
                                                            Ratings:
                                                       </h4>
                                                       <ul className="pl-0">
                                                            {
                                                                [5,4,3,2,1].map(c=>(
                                                                 <li
                                                                 style={{cursor:'pointer' , listStyleType:'none'}} 
                                                                 key={c}
                                                                 onClick={()=>setRating(c)}
                                                                >
                                                                 <div className="rating-outer">
                                                                      <div className="rating-inner" 
                                                                           style={{width:`${c*20}%`}}
                                                                      ></div>
                                                                 </div>
                                                                </li>                                                                 
                                                                ))
                                                            }
                                                       </ul>
                                                  </div>
                                             
                                        </div>
                                   </div>


                                   <div className="col-6 col-md-9">
                                        <div className="row">
                                             {
                                              products && products.map((product)=>(
                                                  <Product product={product} key={product._id} col={4}/>
                                             ))}
                                        </div>
                                   </div>
                              </>
                       ):(
                         products && products.map((product)=>(
                              <Product product={product} key={product._id} col={3}/>
                         ))
                       )
                    }
               </div>
          </section>
        {
          resPerPage<=count &&(
               <div className="d-flex justify-content-center mt-5"> 
               <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={productsCount}
                    onChange={setCurrentPageno }    
                    nextPageText={"Next"}
                    prevPageText={"Previous"}
                    firstPageText={"first"}
                    lastPageText={"last"}
                    itemClass="page-item"
                    linkClass='page-link'
               />
          </div>
          )
        }
    </div>
  )
}

export default Home