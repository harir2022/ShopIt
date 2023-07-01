const mongoose = require('mongoose');

const productSchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter product name"],
        trim:true,
        maxLength:[100,'product name cannot exceed 100 characters']

    },
    price:{
        type:Number,
        required:[true,"Please enter product price"],
        maxLength:[5,'product price cannot exceed 5'],
        default:0.0

    },
    description:{
        type:String,
        required:[true,"Please enter product Description"]

    }, 
    rating:{
        type:Number,
        default:0
    },
    images: [
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String ,
                required:true
            },

        }
    ],

    category:{
        type:String,
        required:[true,'Please select Category for this product'],
        enum:{
            values:[
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
            ],
            message:'Please select correct Catogry for product'

        }
    },

    seller:{
        type:String,
        required:[true,'Please enter product seller']
    },
    stock:{
        type:Number,
        required:[true,'Please enter product stock'],
        maxLength:[5,'Product name cannot  exceed 5 character '],
        default:0

    },
    numofReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {   user:{
                type:mongoose.Schema.ObjectId,
                ref:'user',
                required:true,
        },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    },
    createdByUser:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    } 

})

module.exports= mongoose.model('Product',productSchema);