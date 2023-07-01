const { json } = require("express");

class APIFeatures{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }

    // matches particular character or pattern 
    search(){
        const keyword = this.queryString.keyword ?{
            // checks field name with option of  case insensitive 
            name:{
                $regex:this.queryString.keyword,
                $options:'i' ,
            }

        }:{}

            // console.log(keyword);
        this.query=this.query.find({...keyword});
        return this;
    }

    // keyword=apple&catogory= Food
    // keyword=apple&catogory= Tech
    filter(){
        let queryCopy ={...this.queryString};
        // console.log(queryCopy);

        const toBeRemoved=['keyword','limit','page'];

        toBeRemoved.forEach(el =>  delete queryCopy[el]);
        // console.log(queryCopy);

        //advance filter 
        let queryStr=JSON.stringify(queryCopy);
        queryStr=queryStr.replace(/\b(gte|gt|lt|lte)\b/g , match=>`$${match}`)

        // console.log(JSON.parse(queryStr ));

        this.query=this.query.find(JSON.parse(queryStr));
        return this;
    }    

    //pagination
    //resPerPage =4 ;
    //then if current page is 4 ; then 3 * 4 => 12 products is viewed

    pagination(resPerPage){
        let currentPage= Number(this.queryString.page) || 1;
        let toBeSkipped = resPerPage * (currentPage - 1 );

        this.query=this.query.limit(resPerPage).skip(toBeSkipped);
        return this;

    }

}
module.exports=APIFeatures;