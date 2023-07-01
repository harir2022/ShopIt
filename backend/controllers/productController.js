const Product= require('../models/products')
const APIFeatures = require('../utils/ApiFeatures')
const CatchAsynErrors=require('../middlewares/catchAsynErrors')
const ErrorHandler = require('../utils/ErrorHandler')


const cloudinary = require('cloudinary')
// to store product in db
// api/v1/admin/product/new;
exports.newProduct= CatchAsynErrors(async(req,res,next)=>{

    
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
        console.log(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    
    req.body.createdByUser = req.user.id; // this was added to know about who have added this product ?

    const product = await Product.create(req.body);
    res.status(200).json({
        success:true,
        product
       
    })
})

//api/v1/products
//api/v1/products?keyword=Asus
exports.getProducts = CatchAsynErrors(async (req,res,next)=>{
    
    const resPerPage = 4 ;
    // const PageProductsLength=await Product.countDocuments();
    const  productsCount=await Product.countDocuments();

    const apiFeature = new APIFeatures(Product.find(),req.query)
                        .search()
                        .filter();
    
    // const  productss = await apiFeature.query;
    // const filteredProductsCount = productss.length;
    

    const allProducts = await Product.find();
    let  products = await apiFeature.query;
    apiFeature.pagination(resPerPage);   
    
    if(products.length ==0) products = allProducts;

    // console.log(allProducts)

    let filteredProductsCount = products.length;
        // setTimeout(() => {
            res.status(200).json({
                success:true,
                productsCount,
                // PageProductsLength,
                resPerPage,
                filteredProductsCount,
                // message:"This routes show all products in database"
                products
            })
        // }, 1000);
})


//api/v1/product/:id
exports.getSingleProduct = CatchAsynErrors( async (req,res,next)=>{
    // console.log("request received")
    const product = await Product.findById(req.params.id);

    if(!product){
        // return res.status(404).json({
        //     success:false,
        //     message:"Product not found"
        // })
        return next(new ErrorHandler('product not found',404));
    }

    res.status(200).json({
        success:true,
        product
    })

}
)

// api/v1/admin/product/:id (put request);
    exports.updateProduct= CatchAsynErrors(async(req,res,next)=>{

        let product = await Product.findById(req.params.id);
        if(!product){
            // res.status(404).json({
            //     success:false,
            //     message:"Not Found"
            // })
            return next(new ErrorHandler('product not found',404));
        }

        
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
        console.log(req.body.images)
    } else {
        images = req.body.images
    }


    //no images uploaded yet
    if(images!==undefined) {
                    
            //delete previously uploaded images
            for(let i = 0; i <product.images.length; i++) {
                const res = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }
            
            //new images
                let imagesLinks = [];

                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.v2.uploader.upload(images[i], {
                        folder: 'products'
                    });

                    imagesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url
                    })
                }

                req.body.images = imagesLinks
    }


        
        
        product = await  Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false
        })
        return res.status(200).json({
            success:true,
            product
        })

    })

// api/v1/admin/product/:id (delete req)
exports.deleteProduct =  CatchAsynErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    if(!product){
        // res.status(404).json({
        //     success:false,
        //     message:"Not Found"
        // })
        return next(new ErrorHandler('product not found',404));
    }

    
    for(let i = 0; i <product.images.length; i++) {
        const res = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }



    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product is deleted"
    })
})





// create or update an review 
// api/v1/review;
exports.createProductReview = CatchAsynErrors(async(req,res,next)=>{

    const {productId,rating,comment } = req.body;
    const review ={
            name:req.user.name,
            user:req.user._id,
            rating:Number(rating),
            comment,            
    }

    const thisProduct = await Product.findById(productId);

    const  isReviewed= await thisProduct.reviews.find(
        (r)=>(
                r.user.toString()===req.user._id.toString()
        )
    );

    if(isReviewed){
            thisProduct.reviews.forEach(
                r=>{
                    if(r.user.toString()===req.user._id.toString()){
                        r.comment=comment;
                        r.rating = rating
                    }
                }
            )
    }
    else{
        thisProduct.reviews.push(review);
        thisProduct.numofReviews= thisProduct.reviews.length;
    }

    //calculate overal rating of the product

    thisProduct.rating =( thisProduct.reviews.reduce((accumulator,review)=>{
        return review.rating + accumulator
    },0))   / thisProduct.reviews.length ;


    await thisProduct.save({validateBeforeSave:false});

    res.status(200).json({
        success:true
    });

});


// get all the reviews of product;
exports.getProductReview = CatchAsynErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);
    res.status(200).json({
        success:true,
        reviews: product.reviews
    }); 
}); 


//delete Review ;

exports.deleteReview = CatchAsynErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    const reviews= product.reviews.filter( (r)=>r._id .toString() !== req.query.id.toString());
    // console.log(reviews)
    const numofReviews = reviews.length;
    const rating = reviews.reduce((acc,r)=>{
        return r.rating+acc
    },0);

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        numofReviews,
        rating
    },
    {
        runValidators:true,
        new:true,
        useFindAndModify:false
    }
    )
    res.status(200).json({
        success: true,
        reviews
    })

   
}); 



//api/v1/admin/products
exports.getAdminProducts = CatchAsynErrors(async (req,res,next)=>{
    
    const products = await Product.find();
    
    // setTimeout(() => {
            res.status(200).json({
                success:true,
                // message:"This routes show all products in database"
                products
            })
        // }, 1000);
})