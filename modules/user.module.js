const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
        name:String,
        email:{type:String,required:true},
        password:{type:String,required:true},
        role:{type:String,enum:["User","Moderator"], default:"User"}
})

const UserModel=mongoose.model("user",userSchema)

module.exports={UserModel}