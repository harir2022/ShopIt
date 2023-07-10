const mongoose = require('mongoose');

const createConnection=()=>{
    mongoose.connect(process.env.DB_LOC_URI,{
        
        useNewUrlParser:true,
        useUnifiedTopology:true,    
        // useCreateIndex:true
        
    
    }).then((con)=>{
        console.log(`Mongo db is connected with host: ${con.connection.host}`);
    })
}

module.exports=createConnection;