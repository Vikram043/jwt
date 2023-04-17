const mongoose=require("mongoose")

const blogSchema=mongoose.Schema({
        title:{type:String,required:true},
        des:String,
        user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"UserModule"
        }
})

const BlogModel=mongoose.model("blog",blogSchema)

module.exports={BlogModel}